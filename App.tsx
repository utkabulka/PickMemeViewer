import type { PropsWithChildren } from 'react';
import React, { useState } from 'react';
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
  card_color: string;
  text_color: string;
}>;

function Card({
  text,
  author,
  card_color,
  text_color,
}: CardProps): React.JSX.Element {
  return (
    <View style={[styles.card, {backgroundColor: card_color}]}>
      <Text style={[styles.cardText, {color: text_color}]}>{text}</Text>
      <Text style={[styles.cardText, {color: text_color}]}>
        #{author.toUpperCase()}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [packs, setPacks] = useState([]);

  async function handleAddPacks() {
    try {
      const responses = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
      });
      for (const response of responses) {
        const fileString = await RNFS.readFile(response.uri);
        const pack = JSON.parse(fileString);
        setPacks([...packs, pack]);
      }
    } catch (err) {
      console.warn(`Pack is invalid: ${err}`);
    }
  }

  function getTotalCardCount(): Number {
    let count = 0;
    packs.forEach(pack => {
      count += pack['cards'].length;
    });
    return count;
  }

  function handleClearPackData() {
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
            text="Когда ты когда они и когда они"
            author="автор"
            card_color="#C254BD"
            text_color="#FFFFFF"
          />
          <Button title="Random" />
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
    margin: 8,
    height: 500,
  },
  cardText: {
    fontSize: 32,
  },
});

export default App;
