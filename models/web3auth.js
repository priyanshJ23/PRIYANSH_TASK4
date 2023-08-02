app.get('/web3-auth', async (req, res) => {
    try {
      const user = await Moralis.authenticate({ signingMessage: 'Sign in to our dApp' });
      res.json({ user });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  });