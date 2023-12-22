import React from 'react';
import {PropsWithChildren} from 'react';
import {Text, View} from 'react-native';
import Styles from '../styles/Styles';

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
export type {CardProps};
