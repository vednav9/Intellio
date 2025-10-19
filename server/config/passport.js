import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { sql } from './db.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        const existingUser = await sql`
          SELECT * FROM users WHERE google_id = ${profile.id}
        `;

        if (existingUser.length > 0) {
          // User exists, return user
          return done(null, existingUser[0]);
        }

        // Check if user exists with same email
        const emailUser = await sql`
          SELECT * FROM users WHERE email = ${profile.emails[0].value}
        `;

        if (emailUser.length > 0) {
          // Update existing user with Google ID
          const updatedUser = await sql`
            UPDATE users 
            SET google_id = ${profile.id}, 
                profile_picture = ${profile.photos[0]?.value || null},
                provider = 'google'
            WHERE email = ${profile.emails[0].value}
            RETURNING *
          `;
          return done(null, updatedUser[0]);
        }

        // Create new user
        const newUser = await sql`
          INSERT INTO users (
            name, 
            email, 
            google_id, 
            profile_picture, 
            provider, 
            is_verified
          )
          VALUES (
            ${profile.displayName},
            ${profile.emails[0].value},
            ${profile.id},
            ${profile.photos[0]?.value || null},
            'google',
            true
          )
          RETURNING *
        `;

        done(null, newUser[0]);
      } catch (error) {
        console.error('Google OAuth error:', error);
        done(error, null);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const result = await sql`
      SELECT id, name, email, profile_picture, provider, created_at
      FROM users WHERE id = ${id}
    `;
    done(null, result[0]);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
