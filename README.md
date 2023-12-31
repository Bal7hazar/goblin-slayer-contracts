# Slayer

## About the Game

Slayer is a groundbreaking gaming experience inspired by the universe of the popular manga, Goblin Slayer.

This game is deployed on Starknet, to offer a novel and immersive gameplay experience. Developed using the innovative Dojo framework, it combines elements of strategy, role-playing, and real-time action, ensuring a thrilling adventure for all players.

You can learn more about the game watching the [video trailer](https://www.youtube.com/watch?v=42Oa_rTH3m0)

## How to play?

This rulebook serves as a comprehensive guide to the exciting and challenging world of Slayer game.

Embark on your adventure, outwit the goblins, and rise to the top of the leaderboard!

### Starting Up

Open the client: https://slayer-client.vercel.app/

#### Account Setup

Upon launching the game, a burner account is automatically deployed and stored in cache. Players have the option to personalize their gaming experience by renaming the default account name and deploying a new burner account.

### Movement and Interaction

#### Navigation

Players can move freely across the game map using the WASD keys.

#### Interacting with the Environment

Press the 'E' key to interact with specific locations on the map. These locations are hidden and must be discovered by the player.

#### Initiating Duels

The 'Q' key triggers a duel with a goblin hiding in the tall grass.

### Combat and Duels

#### Duel Mechanics

Duels are turn-based dice games spread over three rounds.

Players face goblins of varying difficulty levels, each with a dice score determined by a unique seed.

To win, players must outscore the goblin in dice rolls over the three rounds.

Each round offers the option to re-roll some or all dice to improve the score.

### Progress and Rewards

#### Earning Gold and Experience

Victories in duels reward players with gold and experience points.

#### Character Enhancement and Leaderboard

Experience points enhance the visual appearance of the player's character and help climb the ranks in the game's leaderboard.

#### Purchasing Bonuses

Gold can be used to buy in-game bonuses, like extra rounds in duels. Note that the in-game shop is inaccessible during duels.

#### Titles and Recognition

Accumulated experience and gold grant players titles that are visible to others in the leaderboard.

### Risks and Penalties

#### Consequences of Defeat

Failing in a duel results in the loss of all accumulated experience.

Players are reset to the base gold level and lose any acquired bonuses.

## VRF Version

A version using the Pragma VRF feature has been implmented and deployed on testnet, however there is no front yet for this version.

World address: 0x5a5719cdf14d12207354a1f1b3c6ce8814fcd9b328c7e3950c78b99f373a46a

You can try it directly on voyager:

-   Open [Voyager](https://goerli.voyager.online/contract/0x0719fcd2cc92c0b43092f45f062f85c5f08f8dd05767e2c1de02c091ab3110ae#writeContract)
-   Create a Slayer with the world address and your slayer name
-   Request a seek using `request_seek` with the world address (the slayer you created is attached to your wallet)
-   What few block and then you can play your duel using the `roll`
-   When your duel ends you can seek again

Note: `seek` function use the tx hash for the duel seed, which is less secure but quicker.

Here is the request seek tx example:

-   https://goerli.voyager.online/tx/0x46e994536ed59cbdf950a61368033de9578ccc2c007507bd68769b9003f844f

And here the VRF callback tx:

-   https://goerli.voyager.online/tx/0x78341e315387e9599c22bb83fbc3f008c374b22009def168fc2f7a2b20c4895

# Development

## Install (in root)

```zsh
pnpm install
```

## Server

```zsh
# add .env then:

pnpm run dev:server
```

## Client

```zsh
pnpm run dev
```

## Deployment

Client - vercel

Chain - slot
