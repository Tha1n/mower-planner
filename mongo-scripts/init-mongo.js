db.createUser({
  user: 'mowerUser',
  pwd: 'mowerPass',
  roles: [
    {
      role: 'readWrite',
      db: 'mowerPlannerDb',
    },
  ],
});
