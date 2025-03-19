# Brayden Simulator

A Tamagotchi-like mobile app where you care for a young programmer named Brayden. Keep him alive, happy, and financially stable!

## App Description

Brayden Simulator is a playful pet simulation game where you take care of a virtual character named Brayden, a skinny blonde programmer who loves board games. As the caretaker, you must manage Brayden's hunger, happiness, energy, health, and finances through different interactions.

Key features:
- Feed Brayden to keep him nourished (costs money)
- Play with Brayden to keep him happy (uses energy)
- Make Brayden code to earn money (uses energy and reduces happiness)
- Manage Brayden's health - if all stats get too low, he can die!
- Purchase collectible items that provide stat bonuses
- Customize Brayden with cosmetic items (hats, glasses, shirts, accessories)
- Play mini-games to earn rewards (Code Racer, Bug Squasher, Memory Match)
- Automatic sleep cycle that recovers energy
- Shake your device to make Brayden dizzy (but be careful not to make him unhappy!)
- Activity history tracking to see how well you've cared for Brayden
- Dark/light theme support
- Level up system with experience points

## App Wireframes

The app consists of the following key screens:

1. **Home Screen** - The main screen showing Brayden's 3D avatar, all stats (health, hunger, happiness, energy), money display, action buttons (feed, play, work), and access to mini-games.

2. **Shop Screen** - A marketplace where players can browse and purchase collectible items that provide stat bonuses and cosmetic items to customize Brayden's appearance.

3. **Wardrobe Screen** - Where players can view owned cosmetic items and equip/unequip them to change Brayden's appearance.

4. **Mini-Games Screen** - Contains three distinct mini-games (Code Racer, Bug Squasher, and Memory Match) that provide rewards upon completion.

5. **History Screen** - Displays a chronological log of activities and interactions with Brayden.

6. **Settings Screen** - Allows customization of app preferences including theme selection (light/dark mode).

## Material Design Implementation

Our application embraces Material Design 3 principles through its comprehensive implementation of the react-native-paper library. We've created a custom theme that follows the M3 color system with a carefully selected palette of primary, secondary, and tertiary colors that represent different aspects of Brayden's life: green for growth and care, orange for warmth and energy, and blue for relaxation. This palette creates a cohesive visual language throughout the app while maintaining excellent contrast and accessibility.

The app's architecture follows Material Design's layering principles with surfaces that provide meaningful elevation through shadows and color differentiation. Interactive elements like buttons are designed with proper states (disabled, pressed, hovered) and follow M3 guidelines for shape, with rounded corners that match the friendly personality of the app. We've implemented appropriate motion through animations that provide feedback and delight, such as the breathing animation on Brayden's avatar, the countdown animation before mini-games, and the transitions between screens.

Typography in our app follows the Material Type scale with appropriate hierarchies that help users understand content priority. We use variant titles like "titleLarge" for section headers and "bodyMedium" for content text, ensuring consistent readability across the app. Components like cards, badges, buttons, and navigation bars are all implemented according to Material Design specifications, creating a familiar and intuitive interface that users can easily understand and navigate while still maintaining the playful character of our Tamagotchi-inspired simulation. We've also implemented contextual theming that adapts based on user preferences (light/dark mode) to ensure the app looks great in any environment.

## Project Requirements Implementation

### Context API Usage

The app utilizes React Context API for state management in several key areas:

1. **BraydenContext**: The core context that manages Brayden's stats, collectibles, achievements, and all gameplay functions. This context makes these values and functions accessible throughout the app without prop drilling.

2. **ThemeContext**: Manages the app's theme (light/dark mode) and provides consistent styling across all components.

3. **ActivityContext**: Tracks and stores all user interactions with Brayden for the history screen.

### Local Data Storage

We use AsyncStorage to persist multiple types of data:

1. **Brayden's Stats**: Hunger, happiness, energy, money, health, level, XP, and other attributes.
2. **Achievements**: Track unlocked achievements and their status.
3. **Collectibles & Cosmetics**: Store ownership and equipped status of items.
4. **Activity History**: Keep a log of all interactions with Brayden.
5. **Theme Preferences**: Store the user's theme preference.

The app saves data automatically when changes occur and loads saved data when the app starts.

### Device Functionality

We leverage several device-specific features:

1. **Accelerometer**: The app uses the accelerometer to detect when the user shakes their device, which makes Brayden dizzy. This is implemented using Expo's Accelerometer API.

2. **Animation and Timing APIs**: Used for various animations like the countdown timer in mini-games and the fast-forward animation when Brayden is sleeping.

3. **Alert System**: Native alerts are used for important notifications like level ups, death events, and mini-game completions.

### Reusable Components

The app is structured with many reusable components:

1. **BraydenAvatar3D**: A customizable 3D avatar component that renders Brayden with various cosmetic items.
2. **StatBar**: A reusable stat visualization component used for all of Brayden's stats.
3. **ActionButton**: A consistent button style used throughout the app.
4. **Mini-Games**: Each mini-game is a self-contained component that can be reused.
5. **ItemCard**: Used in the shop to display items with consistent styling.

## Technologies Used

- React Native with TypeScript
- Expo framework
- React Navigation for screen management
- React Native Paper for Material Design components
- Expo Sensors API for accelerometer integration
- AsyncStorage for local data persistence
- React Context API for state management
- Animated API for fluid animations

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the app: `npx expo start`
4. Run on physical device: Scan the QR code with the Expo Go app
5. Run on Android emulator: Press 'a' in the terminal after startup
6. Run on iOS simulator: Press 'i' in the terminal after startup

## Game Mechanics

### Stats Management
- **Hunger**: Decreases over time, replenished by feeding Brayden
- **Happiness**: Decreases over time, increased by playing with Brayden
- **Energy**: Decreases during activities, regenerates while sleeping
- **Health**: Decreases when other stats are critically low, regenerates when stats are healthy
- **Money**: Earned by working, spent on food and collectibles

### Death Mechanic
If Brayden's health reaches zero, he will die. You can revive him by spending $100, or reset his stats if you don't have enough money.

### Mini-Games
- **Code Racer**: Type code snippets as fast as possible
- **Bug Squasher**: Tap on bugs to squash them before they multiply
- **Memory Match**: Find matching programming language cards 