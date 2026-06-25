import basketUrl from '../../assets/images/cards/da-theme/logos/basket.svg';
import broccoliUrl from '../../assets/images/cards/da-theme/logos/broccoli.svg';
import chefHatUrl from '../../assets/images/cards/da-theme/logos/chef-hat.svg';
import cherryBlossomUrl from '../../assets/images/cards/da-theme/logos/cherry-blossom.svg';
import coinExchangeUrl from '../../assets/images/cards/da-theme/logos/coin-exchange.svg';
import daBubbleUrl from '../../assets/images/cards/da-theme/logos/da-bubble.svg';
import friedEggsUrl from '../../assets/images/cards/da-theme/logos/fried-eggs.svg';
import interlockingShapesUrl from '../../assets/images/cards/da-theme/logos/interlocking-shapes.svg';
import joinLogoUrl from '../../assets/images/cards/da-theme/logos/join-logo.svg';
import oceanWaveUrl from '../../assets/images/cards/da-theme/logos/ocean-wave.svg';
import pokedexUrl from '../../assets/images/cards/da-theme/logos/pokedex.svg';
import portfolioUrl from '../../assets/images/cards/da-theme/logos/portfolio.svg';
import purpleIconUrl from '../../assets/images/cards/da-theme/logos/purple-icon.svg';
import quizAppUrl from '../../assets/images/cards/da-theme/logos/quiz-app.svg';
import ramenBowlUrl from '../../assets/images/cards/da-theme/logos/ramen-bowl.svg';
import sombreroUrl from '../../assets/images/cards/da-theme/logos/sombrero.svg';
import steamingBowlUrl from '../../assets/images/cards/da-theme/logos/steaming-bowl.svg';
import ticTacToeUrl from '../../assets/images/cards/da-theme/logos/tic-tac-toe.svg';

import type { CardDefinition } from '../types/card.types';

/**
 * Defines all card faces available to the DA Projects theme.
 *
 * The deck builder takes the required number of entries from this ordered list
 * to create the 16-, 24-, and 36-card board variants.
 */
export const daProjectsCards: readonly CardDefinition[] = [
  { id: 'ramen-bowl', label: 'Ramen bowl', image: ramenBowlUrl },
  { id: 'steaming-bowl', label: 'Steaming bowl', image: steamingBowlUrl },
  { id: 'fried-eggs', label: 'Fried eggs', image: friedEggsUrl },
  {
    id: 'cherry-blossom',
    label: 'Cherry blossom',
    image: cherryBlossomUrl,
  },
  { id: 'join-logo', label: 'Join logo', image: joinLogoUrl },
  { id: 'chef-hat', label: 'Chef hat', image: chefHatUrl },
  {
    id: 'interlocking-shapes',
    label: 'Interlocking shapes',
    image: interlockingShapesUrl,
  },
  { id: 'basket', label: 'Shopping basket', image: basketUrl },
  { id: 'pokedex', label: 'Pokédex', image: pokedexUrl },
  { id: 'tic-tac-toe', label: 'Tic-tac-toe', image: ticTacToeUrl },
  { id: 'quiz-app', label: 'Quiz app', image: quizAppUrl },
  { id: 'portfolio', label: 'Portfolio', image: portfolioUrl },
  { id: 'da-bubble', label: 'DA bubble', image: daBubbleUrl },
  { id: 'sombrero', label: 'Sombrero', image: sombreroUrl },
  { id: 'broccoli', label: 'Broccoli', image: broccoliUrl },
  { id: 'purple-icon', label: 'Purple icon', image: purpleIconUrl },
  { id: 'ocean-wave', label: 'Ocean wave', image: oceanWaveUrl },
  {
    id: 'coin-exchange',
    label: 'Coin exchange',
    image: coinExchangeUrl,
  },
];
