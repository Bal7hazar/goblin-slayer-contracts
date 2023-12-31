# Slayer

## Trailer

You can learn more about the game watching first the [video trailer](https://www.youtube.com/watch?v=42Oa_rTH3m0)

## How to play?

- Open the client: https://slayer-client.vercel.app/
- If it is the first time you play the game, create a new Slayer by providing a name
- Follow the displayed instructions to play
- Reach the top of the leaderboard

## VRF Version

A version using the Pragma VRF feature has been implmented and deployed on testnet, however there is no front yet for this version.

World address: 0x5a5719cdf14d12207354a1f1b3c6ce8814fcd9b328c7e3950c78b99f373a46a

You can try it directly on voyager:
- Open [Voyager](https://goerli.voyager.online/contract/0x0719fcd2cc92c0b43092f45f062f85c5f08f8dd05767e2c1de02c091ab3110ae#writeContract)
- Create a Slayer with the world address and your slayer name
- Request a seek using `request_seek` with the world address (the slayer you created is attached to your wallet)
- What few block and then you can play your duel using the `roll`
- When your duel ends you can seek again

Note: `seek` function use the tx hash for the duel seed, which is less secure but quicker.

Here is the request seek tx example:
- https://goerli.voyager.online/tx/0x46e994536ed59cbdf950a61368033de9578ccc2c007507bd68769b9003f844f

And here the VRF callback tx:
- https://goerli.voyager.online/tx/0x78341e315387e9599c22bb83fbc3f008c374b22009def168fc2f7a2b20c4895

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
