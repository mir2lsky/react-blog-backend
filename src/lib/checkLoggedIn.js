const checkLoggedIn = (ctx, next) => {
  // console.log('====> checkLoggedIn() ');
  if (!ctx.state.user) {
    ctx.status = 401; // Unauthorized
    return;
  }
  return next();
};

export default checkLoggedIn;
