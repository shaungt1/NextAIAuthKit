#!/usr/bin/env node

import fs from 'fs';
import inquirer from 'inquirer';
import { execSync } from 'child_process';

// Define theme options
const themes = {
  solid: {
    'deep-purple': 'primary-deep-purple',
    'blood-orange': 'primary-blood-orange',
    'hotpink-purple': 'primary-hotpink-purple',
    'green-blue': 'primary-green-blue',
    'deep-blue': 'primary-deep-blue',
    'purple-pink': 'primary-purple-pink',
    'blue-green': 'primary-blue-green'
  },
  gradient: {
    'deep-purple': 'primary-grad-deep-purple',
    'blood-orange': 'primary-grad-blood-orange',
    'hotpink-purple': 'primary-grad-hotpink-purple',
    'green-blue': 'primary-grad-green-blue',
    'deep-blue': 'primary-grad-deep-blue',
    'purple-pink': 'primary-grad-purple-pink',
    'blue-green': 'primary-grad-blue-green'
  }
};

// Prompt the user
inquirer.prompt([
  {
    type: 'list',
    name: 'themeType',
    message: 'Do you want a solid or gradient theme?',
    choices: ['Solid', 'Gradient']
  },
  {
    type: 'list',
    name: 'primaryColor',
    message: 'Select a primary theme color:',
    choices: Object.keys(themes.solid)
  },
  {
    type: 'confirm',
    name: 'customLinks',
    message: 'Would you like to customize link colors?',
    default: false
  }
]).then((answers) => {
  const { themeType, primaryColor, customLinks } = answers;
  const isGradient = themeType === 'Gradient';
  const selectedTheme = isGradient ? themes.gradient[primaryColor] : themes.solid[primaryColor];

  // Generate CSS
  const cssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;

/**********************************************************************************
 * Tailwind Custom Theme System - ${themeType} Color Support
 **********************************************************************************/

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: var(--${selectedTheme});
    --primary-foreground: 0 0% 98%;
    --secondary: var(--secondary-${primaryColor});
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: var(--${selectedTheme});
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: var(--${selectedTheme}-hover);
    --radius: 0.325rem;
    
    ${isGradient ? `
    .bg-primary {
      background-image: var(--${selectedTheme}) !important;
      background-color: var(--${selectedTheme}) !important;
    }
    .hover\\:bg-primary-hover:hover {
      background-image: var(--${selectedTheme}) !important;
      background-color: var(--${selectedTheme}) !important;
    }
    ` : ''}
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: var(--${selectedTheme});
    --primary-foreground: 0 0% 98%;
    --secondary: var(--secondary-${primaryColor});
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: var(--${selectedTheme}-hover);
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: var(--${selectedTheme}-hover);
    --radius: 0.325rem;

    ${isGradient ? `
    .bg-primary {
      background-image: var(--${selectedTheme}) !important;
      background-color: var(--${selectedTheme}) !important;
    }
    .hover\\:bg-primary-hover:hover {
      background-image: var(--${selectedTheme}) !important;
      background-color: var(--${selectedTheme}) !important;
    }
    ` : ''}
  }

  ${customLinks ? `
  @layer base {
    a {
      color: var(--${selectedTheme});
      text-decoration: none;
      transition: color 0.2s ease-in-out;
    }

    a:hover {
      color: var(--${selectedTheme}-hover);
    }

    a:active,
    a:focus {
      color: var(--${selectedTheme}-active);
    }

    a:visited {
      color: var(--${selectedTheme});
    }
  }
  ` : ''}
}
`;

  // Write to index.css
  fs.writeFileSync('index.css', cssContent);

  // Run npm install
  console.log('\nInstalling dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('\n🎨 Theme setup complete! index.css has been generated.');
});
