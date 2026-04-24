/**
 * Fetches cover art at build time from iTunes Search API.
 * Falls back to Spotify oEmbed thumbnail if a spotify_url is provided.
 * Returns null if nothing is found.
 *
 * The iTunes artworkUrl100 can be rewritten to any square size:
 * replace "100x100bb" with e.g. "600x600bb"
 */

const SIZE = '600x600bb';

export async function fetchArtwork(
  artist: string,
  title: string,
  spotifyUrl?: string
): Promise<string | null> {
  // 1. Try iTunes
  try {
    const term = encodeURIComponent(`${artist} ${title}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=song&media=music&limit=5`
    );
    if (res.ok) {
      const data = await res.json();
      const result = data.results?.[0];
      if (result?.artworkUrl100) {
        return (result.artworkUrl100 as string).replace('100x100bb', SIZE);
      }
    }
  } catch {
    // fall through
  }

  // 2. Try Spotify oEmbed thumbnail
  if (spotifyUrl) {
    try {
      const res = await fetch(
        `https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.thumbnail_url) return data.thumbnail_url as string;
      }
    } catch {
      // fall through
    }
  }

  return null;
}
