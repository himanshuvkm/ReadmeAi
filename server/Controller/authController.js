export function getAuthStatus(req, res) {
  const user = req.firebaseUser;
  if (!user) return res.status(401).json({ loggedIn: false });

  res.json({
    loggedIn: true,
    uid: user.uid,
    email: user.email || null,
    name: user.name || null,
    picture: user.picture || null,
  });
}