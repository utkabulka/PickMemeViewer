import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type CardProps = PropsWithChildren<{
  text: string;
  author: string;
  pack_name: string;
  card_color: string;
  text_color: string;
}>;

function Card({
  text,
  author,
  pack_name,
  card_color,
  text_color,
}: CardProps): React.JSX.Element {
  return (
    <View style={[styles.card, {backgroundColor: card_color}]}>
      <Text style={[styles.cardText, {color: text_color}]}>{text}</Text>
      <View>
        <Text style={[styles.cardTextAuthor, {color: text_color}]}>
          {author !== '' ? `#${author.toUpperCase()}` : null}
        </Text>
        <Text style={[styles.cardTextPackName, {color: text_color}]}>
          {pack_name}
        </Text>
      </View>
    </View>
  );
}

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

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [packs, setPacks] = useState<Array<Pack>>([]);

  async function savePacks(newPacks: Array<Pack>) {
    try {
      await AsyncStorage.setItem('packs', JSON.stringify(newPacks));
      console.log('Saved packs');
    } catch (error) {
      console.error(`Failed to save packs: ${error}`);
    }
  }

  useEffect(() => {
    async function getPacks() {
      try {
        const jsonValue = await AsyncStorage.getItem('packs');
        if (jsonValue != null) {
          let loadedPacks = JSON.parse(jsonValue);
          if (loadedPacks.length > 0) {
            setPacks(loadedPacks);
            randomizeCardFromData(loadedPacks);
            console.log(`Loaded ${loadedPacks.length} packs`);
          }
        } else {
          console.log('No packs are loaded');
        }
      } catch (error) {
        console.warn(`Failed to load packs: ${error}`);
      }
    }
    getPacks();
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

  function randomizeCardFromData(packsData: Array<Pack>) {
    if (packsData.length > 0) {
      const pack: Pack =
        packsData[Math.floor(Math.random() * packsData.length)];
      const card: Card =
        pack.cards[Math.floor(Math.random() * pack.cards.length)];
      setCard({
        text: card.text,
        author: pack.author,
        pack_name: pack.pack_name,
        card_color: pack.card_color,
        text_color: pack.text_color,
      });
    }
  }

  function randomizeCard() {
    randomizeCardFromData(packs);
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

  return (
    <SafeAreaView>
      {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
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
          <Button title="Clear all pack data" onPress={handleClearPackData} />
          <Text>Installed {packs.length} packs.</Text>
          <Text>
            There are total of {getTotalCardCount().toString()} cards in the
            library.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 8,
    padding: 24,
    borderRadius: 16,
    height: 600,
  },
  cardText: {
    fontSize: 32,
  },
  cardTextAuthor: {
    fontSize: 32,
    fontWeight: '700',
  },
  cardTextPackName: {
    fontSize: 16,
  },
});

export default App;
