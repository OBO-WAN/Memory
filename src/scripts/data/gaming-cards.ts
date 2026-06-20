import arcadeChaseUrl from '../../assets/images/cards/game-theme/logos/arcade-chase.svg';
import arcadeChomperUrl from '../../assets/images/cards/game-theme/logos/arcade-chomper.svg';
import circleTokenUrl from '../../assets/images/cards/game-theme/logos/circle-token.svg';
import colorfulDiceUrl from '../../assets/images/cards/game-theme/logos/colorful-dice.svg';
import coolBananaUrl from '../../assets/images/cards/game-theme/logos/cool-banana.svg';
import gameControllerUrl from '../../assets/images/cards/game-theme/logos/game-controller.svg';
import handheldConsoleUrl from '../../assets/images/cards/game-theme/logos/handheld-console.svg';
import levelUpBadgeUrl from '../../assets/images/cards/game-theme/logos/level-up-badge.svg';
import marioMushroomUrl from '../../assets/images/cards/game-theme/logos/mario-mushroom.svg';
import mazeUrl from '../../assets/images/cards/game-theme/logos/maze.svg';
import minecraftCreeperUrl from '../../assets/images/cards/game-theme/logos/minecraft-creeper.svg';
import playUrl from '../../assets/images/cards/game-theme/logos/play.svg';
import playingCardUrl from '../../assets/images/cards/game-theme/logos/playing-card.svg';
import puzzlePiecesUrl from '../../assets/images/cards/game-theme/logos/puzzle-pieces.svg';
import snakeGameUrl from '../../assets/images/cards/game-theme/logos/snake-game.svg';
import squareTokenUrl from '../../assets/images/cards/game-theme/logos/square-token.svg';
import starCoinUrl from '../../assets/images/cards/game-theme/logos/star-coin.svg';
import triangleTokenUrl from '../../assets/images/cards/game-theme/logos/triangle-token.svg';

import type { CardDefinition } from '../types/card.types';

export const gamingCards: CardDefinition[] = [
  { id: 'arcade-chase', label: 'Arcade chase', image: arcadeChaseUrl },
  { id: 'arcade-chomper', label: 'Arcade chomper', image: arcadeChomperUrl },
  { id: 'circle-token', label: 'Circle token', image: circleTokenUrl },
  { id: 'colorful-dice', label: 'Colorful dice', image: colorfulDiceUrl },
  { id: 'cool-banana', label: 'Cool banana', image: coolBananaUrl },
  { id: 'game-controller', label: 'Game controller', image: gameControllerUrl },
  { id: 'handheld-console', label: 'Handheld console', image: handheldConsoleUrl },
  { id: 'level-up-badge', label: 'Level-up badge', image: levelUpBadgeUrl },
  { id: 'mario-mushroom', label: 'Mario mushroom', image: marioMushroomUrl },
  { id: 'maze', label: 'Maze', image: mazeUrl },
  { id: 'minecraft-creeper', label: 'Minecraft creeper', image: minecraftCreeperUrl },
  { id: 'play', label: 'Play', image: playUrl },
  { id: 'playing-card', label: 'Playing card', image: playingCardUrl },
  { id: 'puzzle-pieces', label: 'Puzzle pieces', image: puzzlePiecesUrl },
  { id: 'snake-game', label: 'Snake game', image: snakeGameUrl },
  { id: 'square-token', label: 'Square token', image: squareTokenUrl },
  { id: 'star-coin', label: 'Star coin', image: starCoinUrl },
  { id: 'triangle-token', label: 'Triangle token', image: triangleTokenUrl },
];
