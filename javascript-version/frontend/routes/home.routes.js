const router = main;

router.get('/', async (req,res) => {
  res.render("beta/home/home");
})

router.get('/login', async (req, res) => {
  res.render("beta/home/login");
})

router.get('/register', async (req, res) => {
  res.render("beta/home/register");
})