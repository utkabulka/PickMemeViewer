import React from 'react';
import {Text, View} from 'react-native';
import Styles from '../styles/Styles';

type CardData = {
  id: string;
  text: string;
  author: string;
  pack_name: string;
  card_color: string;
  text_color: string;
};

function Card({
  id,
  text,
  author,
  pack_name,
  card_color,
  text_color,
}: CardData): React.JSX.Element {
  if (id === null || id === '') {
    console.warn(
      `Card doesn't have an ID! Pack name: ${pack_name}; Text: '${text}'`,
    );
  }
  return (
    <View style={[Styles.card, {backgroundColor: card_color}]}>
      <Text style={[Styles.cardText, {color: text_color}]}>{text}</Text>
      <View>
        <Text style={[Styles.cardTextAuthor, {color: text_color}]}>
          {author !== '' ? `#${author.toUpperCase()}` : null}
        </Text>
        <Text style={[Styles.cardTextPackName, {color: text_color}]}>
          {pack_name}
        </Text>
      </View>
    </View>
  );
}

export default Card;
export type {CardData};
