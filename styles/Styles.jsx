import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
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

export default Styles;
