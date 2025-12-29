// scripts/seed.ts
import { db } from '@/lib/db';
import {
  comics,
  genres,
  tags,
  blogPosts,
  comicPages,
} from '@/lib/db/schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
  console.log('Seeding database...');
  
  // Seed genres
  const comicGenres = [
    { name: 'Cyberpunk', slug: 'cyberpunk', description: 'High-tech low-life stories', color: '#00ffff' },
    { name: 'Mythology', slug: 'mythology', description: 'Ancient myths and legends', color: '#ff9900' },
    { name: 'Historical', slug: 'historical', description: 'Historical fiction and events', color: '#996633' },
    { name: 'Urban Fantasy', slug: 'urban-fantasy', description: 'Magic in modern settings', color: '#9900ff' },
    { name: 'Adventure', slug: 'adventure', description: 'Action and exploration', color: '#ff3300' },
  ];
  
  const insertedGenres = await db
    .insert(genres)
    .values(comicGenres)
    .returning();
  
  console.log(`Seeded ${insertedGenres.length} genres`);
  
  // Seed tags
  const comicTags = [
    { name: 'African', slug: 'african' },
    { name: 'Futuristic', slug: 'futuristic' },
    { name: 'Folklore', slug: 'folklore' },
    { name: 'Action', slug: 'action' },
    { name: 'Drama', slug: 'drama' },
    { name: 'Fantasy', slug: 'fantasy' },
    { name: 'Sci-Fi', slug: 'sci-fi' },
  ];
  
  const insertedTags = await db
    .insert(tags)
    .values(comicTags)
    .returning();
  
  console.log(`Seeded ${insertedTags.length} tags`);
  
  // Seed sample comics
  const sampleComics = [
    {
      id: 1,
      slug: 'breach-issue-1',
      title: 'BREACH Issue #1',
      description: 'A cyberpunk thriller set in futuristic Lagos where a hacker discovers a conspiracy that threatens to unravel reality itself.',
      image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZClft5PAGpduc014aCIU9Zn5WhQOGosiJETqfK',
      category: 'Cyberpunk',
      rating: 4.8,
      pages: 48,
      readTime: '45 min',
      status: 'Completed',
      tags: ['Cyberpunk', 'Afrofuturism', 'Thriller'],
      featured: false,
      readers: 12500,
      views: 85000,
      publishedAt: '2024-01-15',
      artist: 'Ayo Olojede',
      writer: 'Chizoba Ogbonna',
      genre: ['Cyberpunk', 'Thriller'],
      formats: {
        pdf: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCa9zS0SlcES6McQt13nVuRW8AxgHXpvBeqTk2',
        images: [],
      },
      preferredFormat: 'auto',
    },
    {
      id: 2,
      slug: 'swapped',
      title: 'Swapped',
      description: 'Two friends wake up in each other\'s bodies—confused, panicked, and realizing someone wanted this to happen. Now they must survive each other\'s lives while uncovering who switched them… and why.',
      image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCpOpQBDaFjWu0eatESN5X6Am9bofsQqiVhzHC',
      category: 'Fantasy',
      rating: 4.9,
      pages: 30,
      readTime: '20 min',
      status: 'Coming Soon',
      tags: ['Fantasy', 'Drama', 'Fiction', 'Romance'],
      featured: true,
      readers: 20,
      views: 500,
      publishedAt: '2024-02-01',
      artist: 'Zainab Adekunle',
      writer: 'Adeyemi Kolade',
      genre: ['Fantasy', 'Romance'],
      
    },
    {
      id: 3,
      slug: 'breach-issue-2',
      title: 'Breach Issue #2',
      description: 'Onari\'s journey continues into the Forsaken. still reluctant to join the fight, it is obvious something must be done to save the people',
      image: 'https://globalcomix-comics-assets-files-desktop.nyc3.cdn.digitaloceanspaces.com/26717/7197930_8a65918365201842a63b8f1886bb639f.jpg',
      category: 'Cyberpunk',
      rating: 4.8,
      pages: 48,
      readTime: '45 min',
      status: 'Ongoing',
      tags: ['Cyberpunk', 'Afrofuturism', 'Thriller'],
      featured: true,
      readers: 12500,
      views: 85000,
      publishedAt: '2024-02-10',
      artist: 'Ayo Olojede',
      writer: 'Chizoba Ogbonna',
      issueNumber: 2,
      series: 'BREACH',
      genre: ['Cyberpunk', 'Thriller'],
      formats: {
        pdf: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCXAOCS0n0VGIlgYxKZnju4WmB8wbyLo1TfkNF',
        images: [],
      },
      preferredFormat: 'auto',
    },
    {
      id: 11,
      slug: 'anansi-web',
      title: 'Anansi\'s Web',
      description: 'The trickster spider weaves tales of wisdom and mischief across the African diaspora in this stunning mythological collection.',
      image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&h=1200&fit=crop',
      category: 'Mythology',
      rating: 4.9,
      pages: 64,
      readTime: '60 min',
      status: 'Ongoing',
      tags: ['Mythology', 'Folklore', 'Fantasy'],
      featured: false,
      readers: 9800,
      views: 72000,
      publishedAt: '2024-01-20',
      artist: 'Kofi Asante',
      writer: 'Akosua Mensah',
      genre: ['Mythology', 'Fantasy'],
      
    },
    {
      id: 4,
      slug: 'queen-amina',
      title: 'Queen Amina',
      description: 'The epic story of the warrior queen of Zazzau who built an empire and defended her people against invaders.',
      image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCbEyDNLTjwQiehyaprgucNE83TskxCXJonmIZ',
      category: 'Historical',
      rating: 4.7,
      pages: 56,
      readTime: '52 min',
      status: 'Completed',
      tags: ['Historical', 'Biography', 'Action'],
      featured: false,
      readers: 11200,
      views: 68000,
      publishedAt: '2024-01-05',
      artist: 'Fatima Hassan',
      writer: 'Amara Okafor',
      genre: ['Historical', 'Biography'],
      
    },
    {
      id: 5,
      slug: 'sundiata-epic',
      title: 'Sundiata Epic',
      description: 'The legendary story of the King who founded the Mali Empire, told through breathtaking artwork.',
      image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZC1LKjpK0Pvwy56lfshgk8Vpqr3K9ZYtuG2jzb',
      category: 'Epic',
      rating: 4.6,
      pages: 72,
      readTime: '68 min',
      status: 'Completed',
      tags: ['Epic', 'Historical', 'Fantasy'],
      featured: false,
      readers: 8900,
      views: 55000,
      publishedAt: '2023-12-20',
      artist: 'Moussa Diallo',
      writer: 'Sekou Toure',
      genre: ['Epic', 'Historical'],
      
    },
    {
      id: 6,
      slug: 'underground',
      title: 'Underground',
      description: 'In a neon-drenched future Accra, a detective must solve a mystery that blurs the line between human and AI.',
      image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCGnfHoBkp2lSLbfzjw5TkVhnZ8qrN7eP3BKuQ',
      category: 'Cyberpunk',
      rating: 4.5,
      pages: 40,
      readTime: '38 min',
      status: 'Ongoing',
      tags: ['Cyberpunk', 'Noir', 'Mystery'],
      featured: false,
      readers: 7400,
      views: 42000,
      publishedAt: '2024-01-30',
      artist: 'Kwame Boateng',
      writer: 'Ama Asare',
      genre: ['Cyberpunk', 'Mystery'],
       preferredFormat: 'auto',
    },
    {
      id: 7,
      slug: 'yoruba-pantheon',
      title: 'Yoruba Pantheon',
      description: 'Explore the rich mythology of Yoruba gods and goddesses in this visually stunning anthology.',
      image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCpClP0NaFjWu0eatESN5X6Am9bofsQqiVhzHC',
      category: 'Mythology',
      rating: 4.9,
      pages: 80,
      readTime: '75 min',
      status: 'Completed',
      tags: ['Mythology', 'Anthology', 'Fantasy'],
      featured: false,
      readers: 10200,
      views: 61000,
      publishedAt: '2024-01-10',
      artist: 'Femi Adewale',
      writer: 'Bisi Adeyemi',
      genre: ['Mythology', 'Fantasy'],
    },
    {
      id: 8,
      slug: 'death-metal',
      title: 'Death Metal',
      description: 'Modern-day griots use ancient magic to preserve stories in a world that has forgotten their power.',
      image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCz4fee9CPnOAdf5ZcQCVhPNT1g2Gt6LUlvIS3',
      category: 'Urban Fantasy',
      rating: 4.4,
      pages: 36,
      readTime: '35 min',
      status: 'Ongoing',
      tags: ['Urban Fantasy', 'Magic', 'Contemporary'],
      featured: false,
      readers: 6800,
      views: 38000,
      publishedAt: '2024-02-05',
      artist: 'Abena Mensah',
      writer: 'Kweku Sarpong',
      genre: ['Urban Fantasy'],
    },
    {
      id: 9,
      slug: 'saharan-nomads',
      title: 'Saharan Nomads',
      description: 'Follow the journey of Tuareg nomads across the Sahara in this beautifully illustrated travelogue comic.',
      image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCtD0SP2sTokwtWSCKHZy710dYzip9cuJgEVRa',
      category: 'Travel',
      rating: 4.7,
      pages: 44,
      readTime: '42 min',
      status: 'Completed',
      tags: ['Travel', 'Cultural', 'Adventure'],
      featured: false,
      readers: 5600,
      views: 32000,
      publishedAt: '2023-12-15',
      artist: 'Aisha Ag',
      writer: 'Ibrahim Maiga',
      genre: ['Travel', 'Adventure'],
    },
    {
      id: 10,
      slug: 'final-crisis',
      title: 'Final Crisis',
      description: 'A groundbreaking and thought-provoking event in the DC Universe, where Darkseid uses the Anti-Life Equation to remake heroes, villains, and everyday people in his image, threatening the fabric of reality itself.',
      image: 'https://m.media-amazon.com/images/I/61eKSjHGKsL._SY580_.jpg',
      category: 'Superhero',
      rating: 4.7,
      pages: 44,
      readTime: '42 min',
      status: 'Completed',
      tags: ['Superhero', 'Adventure'],
      featured: false,
      readers: 5600,
      views: 32000,
      publishedAt: new Date('2024-01-25'),
      artist: 'Artist Unknown',
      writer: 'Grant Morrison',
      genre: ['Superhero'],
    },
  ];
  
  const insertedComics = await db
    .insert(comics)
    .values(sampleComics)
    .returning();
  
  console.log(`Seeded ${insertedComics.length} comics`);
  
  // Seed blog posts
  const samplePosts = [
    {
      slug: 'art-of-sequential-storytelling',
      title: 'The Art of Sequential Storytelling',
      excerpt: 'How fashion illustration meets comics in our creative process...',
      content: '# Full MDX content here...',
      author: 'Amina Adebayo',
      category: 'Design',
      featuredImage: '/blog/sequential-storytelling.jpg',
      readingTime: 5,
      status: 'published',
      featured: true,
      publishedAt: new Date('2024-01-10'),
    },
    // Add more posts...
  ];
  
  const insertedPosts = await db
    .insert(blogPosts)
    .values(samplePosts)
    .returning();
  
  console.log(`Seeded ${insertedPosts.length} blog posts`);
  
  console.log('Seeding completed!');
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});