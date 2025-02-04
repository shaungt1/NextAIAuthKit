import { Terminal, Key, Database, Rocket } from "lucide-react";

export const setupSteps = [
  {
    step: 1,
    title: "Run Setup Script 🚀",
    description: "Clone the repo and start setup.",
    icon: Terminal,
    markdown: `
Clone & Setup 🚀:

1.git clone https://github.com/your-repo/NextAIAuthKit.git  
2.cd NextAIAuthKit  
3.Run the startup script in projects root: ./start.sh  
    `,
  },
  {
    step: 2,
    title: "Configure ENV Variables 🔑",
    description: "Set API keys for AI & authentication.",
    icon: Key,
    markdown: `
Set API Keys 🔑:

1.OPENAI_API_KEY=your_openai_key  
2.GOOGLE_CLIENT_ID=your_google_client_id  
3.GOOGLE_CLIENT_SECRET=your_google_client_secret  
    `,
  },
  {
    step: 3,
    title: "Setup Database 🗄️",
    description: "Initialize Prisma and migrate the DB.",
    icon: Database,
    markdown: `
Database Setup 🗄️:

1.Go to prism folder and in the schema.prisma file, set the database connection string to your DB. Defualt is sqlite. 
2.Run comand to set up prisma: npx prisma init  
3.Run comand to migrate and generate tables: npx prisma migrate dev  
    `,
  },
  {
    step: 4,
    title: "Start Development 💻",
    description: "Run the app and start coding.",
    icon: Rocket,
    markdown: `
Run the App💻:

1.Start the app in dev mode to start building: npm run dev  
2.Go to http://localhost:1880 to see the app running. chnage in package.json if you want to change the port.
3.Start building your AI app with NextAIAuthKit. read the docs folder for more info and getting started guide.
4.Replace the 'HomePage' and Happy Coding!🚀
    `,
  },
];
