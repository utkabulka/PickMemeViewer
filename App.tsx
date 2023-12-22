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
import Card, {CardProps} from './components/Card';

type Pack = {
  data_version: Number;
  pack_version: Number;
  id: string;
  pack_name: string;
  language: string;
  author: string;
  card_color: string;
  text_color: string;
  cards: Array<Card>;
};

type Card = {
  id: string;
  text: string;
};

const PACKS_KEY = 'packs';
const DRAWN_CARDS_KEY = 'drawnCards';
const HISTORY_KEY = 'history'; // TODO: implement history

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [packs, setPacks] = useState<Array<Pack>>([]);
  const [drawnCards, setDrawnCards] = useState<Array<string>>([]);

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
            randomizeCardFromData(loadedPacks);
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

  const [cardProps, setCard] = useState<CardProps>({
    text: 'Add some packs!',
    author: '',
    pack_name: '',
    card_color: '#FF0073',
    text_color: '#FFFFFF',
  });

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

  function randomizeCard() {
    return randomizeCardFromData(packs);
  }
  function randomizeCardFromData(packsData: Array<Pack>) {
    if (packsData.length > 0) {
      let pack: Pack;
      let card: Card;
      while (true) {
        // get random card
        pack = packsData[Math.floor(Math.random() * packsData.length)];
        card = pack.cards[Math.floor(Math.random() * pack.cards.length)];
        if (!drawnCards.includes(card.id)) {
          break;
        }
      }

      setCard({
        text: card.text,
        author: pack.author,
        pack_name: pack.pack_name,
        card_color: pack.card_color,
        text_color: pack.text_color,
      });

      const newDrawnCards: Array<string> = [...drawnCards, card.id];
      setDrawnCards(newDrawnCards);
      saveDrawnCards(newDrawnCards);
    }
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
            text={cardProps.text}
            author={cardProps.author}
            pack_name={cardProps.pack_name}
            card_color={cardProps.card_color}
            text_color={cardProps.text_color}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
