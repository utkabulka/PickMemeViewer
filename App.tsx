import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Card, {CardData} from './components/Card';
import SettingsScreen from './components/SettingsScreen';

type Pack = {
  data_version: Number;
  pack_version: Number;
  id: string;
  pack_name: string;
  language: string;
  author: string;
  card_color: string;
  text_color: string;
  cards: Array<CardData>;
};

const PACKS_KEY = 'packs';
const DRAWN_CARDS_KEY = 'drawnCards';
const HISTORY_KEY = 'history'; // TODO: implement history
const SETTINGS_KEY = 'settings'; // TODO: implement settings

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [packs, setPacks] = useState<Array<Pack>>([]);
  const [drawnCards, setDrawnCards] = useState<Array<string>>([]);
  const [card, setCard] = useState<CardData>({
    id: '0',
    text: 'Add some packs!',
    author: '',
    pack_name: '',
    card_color: '#FF0073',
    text_color: '#FFFFFF',
  });

  async function savePacks(newPacks: Array<Pack>) {
    try {
      await AsyncStorage.setItem(PACKS_KEY, JSON.stringify(newPacks));
      console.log('Saved packs');
    } catch (error) {
      console.error(`Failed to save packs: ${error}`);
    }
  }

  async function saveDrawnCards(newDrawnCards: Array<string>) {
    try {
      await AsyncStorage.setItem(
        DRAWN_CARDS_KEY,
        JSON.stringify(newDrawnCards),
      );
    } catch (error) {
      console.error(`Failed to save drawn cards: ${error}`);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        // loading installed packs
        let jsonValue = await AsyncStorage.getItem(PACKS_KEY);
        if (jsonValue != null) {
          const loadedPacks = JSON.parse(jsonValue);
          if (loadedPacks.length > 0) {
            setPacks(loadedPacks);
            const randomCard = getRandomCardFromData(loadedPacks);
            if (randomCard != null) {
              setCard(randomCard);
            }
          }
        } else {
          console.log('No packs were loaded');
        }
        // loading drawn cards
        jsonValue = await AsyncStorage.getItem(DRAWN_CARDS_KEY);
        if (jsonValue != null) {
          const loadedDrawnCards = JSON.parse(jsonValue);
          if (loadedDrawnCards.length > 0) {
            setDrawnCards(loadedDrawnCards);
          }
        } else {
          console.log('No drawn cards were loaded');
        }
      } catch (error) {
        console.warn(`Failed to load packs: ${error}`);
      }
    }
    loadData();
  }, []);

  async function handleAddPacks() {
    let newPacks = [...packs];
    try {
      const responses = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
      });
      for (const response of responses) {
        const fileString = await RNFS.readFile(response.uri);
        const pack = JSON.parse(fileString);
        if (doesPackExist(pack.id)) {
          console.warn(`Pack "${pack.pack_name}" is already added!`);
        } else {
          newPacks.push(pack);
          console.log(`Added pack ${pack.pack_name}`);
        }
      }
    } catch (error) {
      console.warn(`Pack is invalid: ${error}`);
    }
    setPacks(newPacks);
    await savePacks(newPacks);
  }

  function getRandomCard(): CardData | null {
    return getRandomCardFromData(packs);
  }
  function getRandomCardFromData(packsData: Array<Pack>): CardData | null {
    if (packsData.length > 0) {
      let randomPack: Pack;
      let randomCard: CardData;
      while (true) {
        // get random card
        randomPack = packsData[Math.floor(Math.random() * packsData.length)];
        randomCard =
          randomPack.cards[Math.floor(Math.random() * randomPack.cards.length)];
        if (!drawnCards.includes(randomCard.id)) {
          return {
            id: randomCard.id,
            text: randomCard.text,
            author: randomPack.author,
            pack_name: randomPack.pack_name,
            card_color: randomPack.card_color,
            text_color: randomPack.text_color,
          };
        }
      }
    }
    return null;
  }

  function randomizeCard() {
    const randomCard = getRandomCard();
    if (randomCard !== null) {
      setCard(randomCard);
      addDrawnCard(randomCard.id);
    }
  }

  function addDrawnCard(cardId: string) {
    const newDrawnCards: Array<string> = [...drawnCards, cardId];
    setDrawnCards(newDrawnCards);
    saveDrawnCards(newDrawnCards);
  }

  function getTotalCardCount(): Number {
    let count = 0;
    packs.forEach(pack => {
      if (pack.cards !== undefined && pack.cards.length > 0) {
        count += pack.cards.length;
      } else {
        console.warn(`Pack ${pack.pack_name} is undefined!`);
      }
    });
    return count;
  }

  function doesPackExist(id: String): Boolean {
    for (const pack of packs) {
      if (pack.id === id) {
        return true;
      }
    }
    return false;
  }

  function handleClearPackData() {
    savePacks([]);
    setPacks([]);
  }

  function handleClearDrawnCards() {
    setDrawnCards([]);
  }

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Card
            id={card.id}
            text={card.text}
            author={card.author}
            pack_name={card.pack_name}
            card_color={card.card_color}
            text_color={card.text_color}
          />
          <Button title="Random" onPress={randomizeCard} />
          <Button title="Add pack(s)" onPress={handleAddPacks} />
          <Button title="Clear drawn cards" onPress={handleClearDrawnCards} />
          <Button title="Clear all pack data" onPress={handleClearPackData} />
          <Text>Installed {packs.length} packs.</Text>
          <Text>
            There are total of {getTotalCardCount().toString()} cards in the
            library.
          </Text>
          <Text>There are {drawnCards.length} cards already drawn.</Text>
          <SettingsScreen />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
