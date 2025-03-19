# Brayden Simulator

A Tamagotchi-like mobile app where you care for a young programmer named Brayden. Keep him alive, happy, and financially stable!

## App Description

Brayden Simulator is a playful pet simulation game where you take care of a virtual character named Brayden, a skinny blonde programmer who loves board games. As the caretaker, you must manage Brayden's hunger, happiness, energy, and finances through different interactions.

Key features:
- Feed Brayden to keep him nourished (costs money)
- Play board games with Brayden to keep him happy (uses energy)
- Make Brayden code to earn money (uses energy and reduces happiness)
- Automatic sleep cycle based on your environment's light level
- Activity history tracking to see how well you've cared for Brayden
- Dark/light theme support

The app uses the device's light sensor to determine when Brayden should sleep - when it's dark in your environment, Brayden will automatically go to sleep to recover energy.

## App Wireframes

[Images of wireframes would be placed here]

## Material Design Implementation

Our application embraces Material Design 3 principles through its comprehensive implementation of the react-native-paper library. We've created a custom theme that follows the M3 color system with a carefully selected palette of primary, secondary, and tertiary colors that represent different aspects of Brayden's life: green for growth and care, orange for warmth and energy, and blue for relaxation. This palette creates a cohesive visual language throughout the app while maintaining excellent contrast and accessibility.

The app's architecture follows Material Design's layering principles with surfaces that provide meaningful elevation through shadows and color differentiation. Interactive elements like buttons are designed with proper states (disabled, pressed, hovered) and follow M3 guidelines for shape, with rounded corners that match the friendly personality of the app. We've implemented appropriate motion through animations that provide feedback and delight, such as the breathing animation on Brayden's avatar and the transitions between screens.

Typography in our app follows the Material Type scale with appropriate hierarchies that help users understand content priority. We use variant titles like "titleLarge" for section headers and "bodyMedium" for content text, ensuring consistent readability across the app. Components like the FAB (Floating Action Button), cards, badges, and navigation bars are all implemented according to Material Design specifications, creating a familiar and intuitive interface that users can easily understand and navigate while still maintaining the playful character of our Tamagotchi-inspired simulation.

## Technologies Used

- React Native with TypeScript
- Expo framework
- React Navigation for screen management
- React Native Paper for Material Design components
- Expo Sensors API for light sensor integration
- AsyncStorage for local data persistence
- React Context API for state management

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the app: `npm start`
4. Run on Android emulator: Press 'a' in the terminal after startup 