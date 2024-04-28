This app allows you to claim rewards from the different Moonwell markets without using the button on the frontend.

Why do you need this? Because the button on Moonwell's frontend claims rewards for all the markets and that is gas consuming (hence making you pay more gas).

I did this because i'm lazy enough to not do this via etherscan every time, and also because i dont want to pay more fees than i should. The code is open and you can find it at the footer.

You can also do this by yourself on etherscan, go to the Comptroller contract, get the contract address for the market you are in and then use the claimRewards function using your address and the market address


## Run yourself

```
npm i
npm run dev
```