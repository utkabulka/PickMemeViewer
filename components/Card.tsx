import React from 'react';
import {Text, View} from 'react-native';
import Styles from '../styles/Styles';

type CardData = {
  id: string;
  text: string;
  author: string | null;
  pack_name: string | null;
  card_colors: CardColors;
};

type CardColors = {
  card_color: string;
  text_color: string;
};

function Card({
  id,
  text,
  author,
  pack_name,
  card_colors,
}: CardData): React.JSX.Element {
  if (id === null || id === '') {
    console.warn(
      `Card doesn't have an ID! Pack name: ${pack_name}; Text: '${text}'`,
    );
  }
  return (
    <View style={[Styles.card, {backgroundColor: card_colors.card_color}]}>
      <Text style={[Styles.cardText, {color: card_colors.text_color}]}>
        {text}
      </Text>
      <View>
        <Text style={[Styles.cardTextAuthor, {color: card_colors.text_color}]}>
          {author !== null ? `#${author.toUpperCase()}` : null}
        </Text>
        <Text
          style={[Styles.cardTextPackName, {color: card_colors.text_color}]}>
          {pack_name !== null ? pack_name : null}
        </Text>
      </View>
    </View>
  );
}

export default Card;
export type {CardData, CardColors};
