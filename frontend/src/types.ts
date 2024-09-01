// src/types.ts

// Define the structure of a Song object
export interface Song {
    id: string;
    title: string;
    artist: string;
    album?: string; // Optional field
    year?: number;  // Optional field
    genre?: string; // Optional field
  }
  
  // You might also define other types related to your application
  export interface Stats {
    totalSongs: number;
    totalArtists: number;
    totalAlbums: number;
  }
  
  // You could add more interfaces or types as needed
  