import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Routes_ from "../routes/routes";
//const User = mongoose.model('User', userSchema);
//const user = await User.findOne({ username: 'exampleUser' });


const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Routes_ />
      </main>
      <Footer />
    </>
  );
};

export default Layout;