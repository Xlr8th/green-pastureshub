import './Welcome.css';

const Welcome = () => {
  return (
    <section className="welcome">

      {/* Top ornament */}
      <div className="welcome-ornament">
        <span className="ornament-line" />
        <span className="ornament-gem">✦</span>
        <span className="ornament-line" />
      </div>

      <div className="welcome-inner">

        <p className="welcome-opener" data-aos="fade-up">
          Welcome to Green Pastures — where faith meets everyday living.
          I'm really glad you're here.
        </p>

        <p className="welcome-body" data-aos="fade-up">
          This is a space created for everyday believers who are simply trying to walk with God,
          grow in His Word, and live out their faith in real, practical ways. Life can get busy
          and overwhelming, but we all need moments where we can pause, breathe, and be reminded
          of God's truth! And that's what this blog is all about.
        </p>

        <blockquote className="welcome-quote" data-aos="fade-up">
          <span className="quote-mark">"</span>
          We all need moments where we can pause, breathe,<br />
          and be reminded of God's truth.
          <span className="quote-mark">"</span>
        </blockquote>

        <p className="welcome-body" data-aos="fade-up">
          At Green Pastures, we talk about the things that matter; like living a Christ-centered
          life, understanding God's Word, building strong marriages, raising children with godly
          values, and becoming who God has called us to be. You'll also find uplifting fictional
          stories designed to encourage your heart and strengthen your faith.
        </p>

        <p className="welcome-closing" data-aos="fade-up" >
          Whether you're here for guidance, encouragement, or just a quiet moment with something
          meaningful, you're in the right place. So take your time, look around, and feel at home.
        </p>

      </div>

      {/* Bottom ornament */}
      <div className="welcome-ornament" data-aos="fade-up">
        <span className="ornament-line" />
        <span className="ornament-gem">✦</span>
        <span className="ornament-line" />
      </div>

    </section>
  );
};

export default Welcome;