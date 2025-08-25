import Link from "next/link";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <span role="img" aria-label="heart">
          ❤️
        </span>{" "}
        DonorConnect
      </div>
      <ul style={styles.navLinks}>
        <li style={styles.navItem}>
          <Link href="/" style={styles.link}>
            Home
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/about" style={styles.link}>
            About
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/auth/donor" style={styles.link}>
            Donor
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/auth/receiver" style={styles.link}>
            Receiver
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/auth/admin" style={styles.link}>
            Admin
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/contact" style={styles.link}>
            Contact
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/profile" style={styles.link}>
            Profile
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/login" style={styles.link}>
            Login/Register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#000",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 30px",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "20px",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: "20px",
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontWeight: "500",
    cursor: "pointer",
  },
};

export default Navbar;
