import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  Alert,
  BackHandler 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBrayden } from '../contexts/BraydenContext';
import { useTheme } from '../contexts/ThemeContext';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define params for the MiniGameScreen
export type MiniGameParams = {
  MiniGame: {
    gameType: 'codeRacer' | 'bugSquasher' | 'memoryMatch';
  };
};

type MiniGameScreenNavigationProp = NativeStackNavigationProp<MiniGameParams, 'MiniGame'>;
type MiniGameScreenRouteProp = RouteProp<MiniGameParams, 'MiniGame'>;

interface MiniGameScreenProps {
  navigation: MiniGameScreenNavigationProp;
  route: MiniGameScreenRouteProp;
}

// CodeRacer Mini-Game
const CodeRacerGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Example code snippets to type
  const codeSnippets = [
    'const hello = "world";',
    'function add(a, b) { return a + b; }',
    'let array = [1, 2, 3, 4];',
    'console.log("Hello World");',
    'const user = { name: "Brayden" };',
  ];
  
  // Current snippet to type
  const [currentSnippet, setCurrentSnippet] = useState(codeSnippets[0]);
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle key press
  const handleKeyPress = (key: string) => {
    if (gameOver) return;
    
    if (key === currentSnippet[currentIndex]) {
      setCurrentIndex(currentIndex + 1);
      setScore(score + 1);
      
      // If completed current snippet
      if (currentIndex + 1 >= currentSnippet.length) {
        const nextSnippetIndex = Math.floor(Math.random() * codeSnippets.length);
        setCurrentSnippet(codeSnippets[nextSnippetIndex]);
        setCurrentIndex(0);
        setScore(score + 10); // Bonus for completing snippet
      }
    } else {
      // Penalty for wrong key
      setScore(Math.max(0, score - 2));
    }
  };
  
  // End game
  useEffect(() => {
    if (gameOver && !gameCompleted) {
      setGameCompleted(true);
      onComplete(score);
    }
  }, [gameOver, score, onComplete, gameCompleted]);
  
  // Simple keyboard for demo
  const keys = 'abcdefghijklmnopqrstuvwxyz0123456789 (){};=+".,_'.split('');
  
  return (
    <View style={styles.miniGameContainer}>
      <Text style={[styles.gameTitle, { color: theme.colors.primary }]}>Code Racer</Text>
      
      <View style={styles.statsRow}>
        <Text style={styles.statText}>Time: {timeLeft}s</Text>
        <Text style={styles.statText}>Score: {score}</Text>
      </View>
      
      <View style={[styles.codeDisplay, { backgroundColor: theme.colors.surface }]}>
        <Text style={{ color: theme.colors.onBackground }}>
          {currentSnippet.split('').map((char, index) => {
            if (index < currentIndex) {
              return <Text key={index} style={{ color: 'green' }}>{char}</Text>;
            } else if (index === currentIndex) {
              return <Text key={index} style={{ backgroundColor: 'rgba(255,255,0,0.3)' }}>{char}</Text>;
            } else {
              return <Text key={index} style={{ color: theme.colors.onBackground }}>{char}</Text>;
            }
          })}
        </Text>
      </View>
      
      <View style={styles.keyboard}>
        {keys.map((key, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.key, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleKeyPress(key)}
          >
            <Text style={{ color: theme.colors.onBackground }}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Bug Squasher Mini-Game
const BugSquasherGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const { theme } = useTheme();
  const [bugs, setBugs] = useState<{ id: number, x: number, y: number, scale: number }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Timer and bug spawning effect
  useEffect(() => {
    // Timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Bug spawner
    const bugSpawner = setInterval(() => {
      if (bugs.length < 10) {
        const newBug = {
          id: Date.now(),
          x: Math.random() * (width - 50),
          y: Math.random() * (height / 2 - 50) + 100,
          scale: 0.7 + Math.random() * 0.6,
        };
        setBugs(prev => [...prev, newBug]);
      }
    }, 1000);
    
    return () => {
      clearInterval(timer);
      clearInterval(bugSpawner);
    };
  }, [bugs.length]);
  
  // End game
  useEffect(() => {
    if (gameOver && !gameCompleted) {
      setGameCompleted(true);
      onComplete(score);
    }
  }, [gameOver, score, onComplete, gameCompleted]);
  
  // Squash bug
  const squashBug = (id: number) => {
    setBugs(bugs.filter(bug => bug.id !== id));
    setScore(score + 10);
  };
  
  return (
    <View style={styles.miniGameContainer}>
      <Text style={[styles.gameTitle, { color: theme.colors.primary }]}>Bug Squasher</Text>
      
      <View style={styles.statsRow}>
        <Text style={styles.statText}>Time: {timeLeft}s</Text>
        <Text style={styles.statText}>Score: {score}</Text>
        <Text style={styles.statText}>Bugs: {bugs.length}</Text>
      </View>
      
      <View style={[styles.gameArea, { backgroundColor: theme.colors.surface }]}>
        {bugs.map(bug => (
          <TouchableOpacity
            key={bug.id}
            style={[styles.bug, { left: bug.x, top: bug.y, transform: [{ scale: bug.scale }] }]}
            onPress={() => squashBug(bug.id)}
          >
            <MaterialCommunityIcons name="bug" size={40} color="red" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Memory Match Mini-Game
const MemoryMatchGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const { theme } = useTheme();
  const [cards, setCards] = useState<{ id: number, content: string, flipped: boolean, matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Programming language cards
  const cardContents = [
    'javascript', 'python', 'java', 'rust', 
    'typescript', 'ruby', 'go', 'csharp'
  ];
  
  // Initialize cards
  useEffect(() => {
    const initialCards = [...cardContents, ...cardContents].map((content, index) => ({
      id: index,
      content,
      flipped: false,
      matched: false,
    }));
    
    // Shuffle cards
    for (let i = initialCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
    }
    
    setCards(initialCards);
  }, []);
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Check for game over
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameOver(true);
      const finalScore = score + timeLeft * 10; // Bonus for remaining time
      setScore(finalScore);
    }
  }, [cards, score, timeLeft]);
  
  // End game
  useEffect(() => {
    if (gameOver && !gameCompleted) {
      setGameCompleted(true);
      onComplete(score);
    }
  }, [gameOver, score, onComplete, gameCompleted]);
  
  // Flip card
  const flipCard = (id: number) => {
    if (flippedCards.length === 2 || gameOver) return;
    
    // Can't flip already matched or flipped cards
    const card = cards.find(c => c.id === id);
    if (card?.matched || card?.flipped) return;
    
    // Flip card
    setCards(cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    ));
    
    // Add to flipped cards
    setFlippedCards([...flippedCards, id]);
    
    // If two cards flipped, check for match
    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      
      const firstCard = cards.find(c => c.id === flippedCards[0]);
      const secondCard = cards.find(c => c.id === id);
      
      if (firstCard?.content === secondCard?.content) {
        // Match found
        setCards(cards.map(card => 
          card.id === id || card.id === flippedCards[0]
            ? { ...card, matched: true }
            : card
        ));
        setFlippedCards([]);
        setScore(score + 20);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === id || card.id === flippedCards[0]
              ? { ...card, flipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  // Get icon for card
  const getCardIcon = (content: string) => {
    switch (content) {
      case 'javascript': return 'language-javascript';
      case 'python': return 'language-python';
      case 'java': return 'language-java';
      case 'rust': return 'language-rust';
      case 'typescript': return 'language-typescript';
      case 'ruby': return 'language-ruby';
      case 'go': return 'language-go';
      case 'csharp': return 'language-csharp';
      default: return 'code-tags';
    }
  };
  
  return (
    <View style={styles.miniGameContainer}>
      <Text style={[styles.gameTitle, { color: theme.colors.primary }]}>Memory Match</Text>
      
      <View style={styles.statsRow}>
        <Text style={styles.statText}>Time: {timeLeft}s</Text>
        <Text style={styles.statText}>Moves: {moves}</Text>
        <Text style={styles.statText}>Score: {score}</Text>
      </View>
      
      <View style={styles.cardGrid}>
        {cards.map(card => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              { 
                backgroundColor: card.flipped || card.matched 
                  ? theme.colors.primary 
                  : theme.colors.surface 
              }
            ]}
            onPress={() => flipCard(card.id)}
          >
            {(card.flipped || card.matched) && (
              <MaterialCommunityIcons 
                name={getCardIcon(card.content)} 
                size={24} 
                color="white" 
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const MiniGameScreen: React.FC<MiniGameScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { gameType } = route.params;
  const { playMiniGame } = useBrayden();
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const countdownAnim = useRef(new Animated.Value(1)).current;
  
  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Quit Game',
        'Are you sure you want to quit? Your progress will be lost.',
        [
          { text: 'Stay', style: 'cancel', onPress: () => {} },
          { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
      return true;
    });
    
    return () => backHandler.remove();
  }, [navigation]);
  
  // Countdown animation
  useEffect(() => {
    const animateCountdown = () => {
      Animated.sequence([
        Animated.timing(countdownAnim, {
          toValue: 1.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(countdownAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    };
    
    if (showCountdown) {
      animateCountdown();
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowCountdown(false);
            return 0;
          }
          animateCountdown();
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [countdownAnim, showCountdown]);
  
  // Handle game completion
  const handleGameComplete = (score: number) => {
    // Simulate playing the mini-game to earn rewards
    playMiniGame(gameType);
    
    // Show results and go back
    Alert.alert(
      'Game Over!',
      `Your score: ${score}\n\nYou earned rewards for playing!`,
      [{ text: 'Continue', onPress: () => navigation.goBack() }]
    );
  };
  
  // Render countdown overlay
  if (showCountdown) {
    return (
      <View style={[styles.countdownContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.gameTypeText, { color: theme.colors.primary }]}>
          {gameType === 'codeRacer' && 'Code Racer'}
          {gameType === 'bugSquasher' && 'Bug Squasher'}
          {gameType === 'memoryMatch' && 'Memory Match'}
        </Text>
        
        <Animated.Text 
          style={[
            styles.countdownText, 
            { 
              color: theme.colors.primary,
              transform: [{ scale: countdownAnim }] 
            }
          ]}
        >
          {countdown}
        </Animated.Text>
        
        <Text style={[styles.getReadyText, { color: theme.colors.onBackground }]}>
          Get Ready!
        </Text>
      </View>
    );
  }
  
  // Render the appropriate mini-game
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {gameType === 'codeRacer' && <CodeRacerGame onComplete={handleGameComplete} />}
      {gameType === 'bugSquasher' && <BugSquasherGame onComplete={handleGameComplete} />}
      {gameType === 'memoryMatch' && <MemoryMatchGame onComplete={handleGameComplete} />}
      
      <TouchableOpacity 
        style={[styles.quitButton, { backgroundColor: theme.colors.error }]}
        onPress={() => {
          Alert.alert(
            'Quit Game',
            'Are you sure you want to quit? Your progress will be lost.',
            [
              { text: 'Stay', style: 'cancel', onPress: () => {} },
              { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() }
            ]
          );
        }}
      >
        <Text style={styles.quitButtonText}>Quit Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  futureUpdateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  futureUpdateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  futureUpdateText: {
    fontSize: 18,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  miniGameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Code Racer styles
  codeDisplay: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    minHeight: 80,
    justifyContent: 'center',
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  key: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 5,
  },
  // Bug Squasher styles
  gameArea: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    position: 'relative',
  },
  bug: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Memory Match styles
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  card: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTypeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 80,
    fontWeight: 'bold',
  },
  getReadyText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quitButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  quitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
});

export default MiniGameScreen; 