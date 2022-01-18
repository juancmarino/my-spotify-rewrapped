import Head from 'next/head';

import Layout from '@components/Layout';
import Container from '@components/Container';

import styles from '@styles/Home.module.scss'
import { getSecrets } from '@netlify/functions';

export default function Home({artists, tracks}) {
  return (
    <Layout>
      <Head>
        <title>Spotify Re-Wrapped</title>
        <meta name="description" content="Top artists and tracks for the last whatever period of time..." />
      </Head>

      <Container>
        <h1 className="sr-only">Spotify Re-Wrapped</h1>

        <h2 className={styles.heading}>Top Artists</h2>

        <ul className={styles.items}>
        {artists.map(artist => {
            return (
              <a key={artist.id} href={artist.external_urls.spotify} className={styles.card}>
                {artist.images[0] && (
                  <img width={artist.images[0].width} height={artist.images[0].height} src={artist.images[0].url} alt="" />
                )}
                <h2>{ artist.name }</h2>
              </a>
            );
          })}
        </ul>

        <h2 className={styles.heading}>Top Tracks</h2>

        <ul className={styles.items}>
        {tracks.map(track => {
            return (
              <a key={track.album.id} href={track.album.external_urls.spotify} className={styles.card}>
                {track.album.images[0] && (
                  <img width={track.album.images[0].width} height={track.album.images[0].height} src={track.album.images[0].url} alt="" />
                )}
                <h2>{ track.album.name }</h2>
              </a>
            );
          })}
        </ul>
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {

  const secrets = await getSecrets();

  const artistsResponse = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=4`, {
    headers: {
      Authorization: `Bearer ${secrets.spotify.bearerToken}`,
    }
  });

  const { items: artists } = await artistsResponse.json();

  const tracksResponse = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=4`, {
    headers: {
    Authorization: `Bearer ${secrets.spotify.bearerToken}`,
      }
    });
  
  const { items: tracks } = await tracksResponse.json();

  return {
    props: {
      artists,
      tracks
    }
  }
}