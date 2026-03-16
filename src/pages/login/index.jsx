import React from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import BackgroundPattern from './components/BackgroundPattern';
import CredentialsHelper from './components/CredentialsHelper';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Login - Disaster Preparedness and Response Education System</title>
        <meta
          name="description"
          content="Secure login to the Disaster Preparedness and Response Education System for public users, students, staff, and institutions."
        />
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        <BackgroundPattern />

        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="px-4 sm:px-6 lg:px-8 pt-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-soft">
                  <Icon name="Shield" size={24} color="white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">DisasterEd</div>
                  <div className="text-sm text-muted-foreground">Disaster Preparedness and Response Education System</div>
                </div>
              </div>

              <div className="hidden md:flex items-center text-sm text-muted-foreground">
                Google Sign-In with Firebase Authentication
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <div className="max-w-7xl mx-auto h-full">
              <div className="max-w-md mx-auto mb-6">
                <LoginForm />
              </div>

              <div className="max-w-md mx-auto mb-8">
                <div className="rounded-2xl border border-border bg-card/85 backdrop-blur-md p-4 shadow-soft">
                  <CredentialsHelper />
                  <p className="text-sm text-muted-foreground mt-2">
                    Add Firebase config first, then sign in to access your profile, progress, alerts, and preparedness tools.
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-1 gap-6 lg:gap-8 items-stretch">
                <section className="bg-card/75 backdrop-blur-md border border-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-elevated">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
                      <Icon name="Radio" size={14} />
                      <span>Public safety learning platform</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                      Learn, practice, and stay ready for real emergencies.
                    </h1>
                    <p className="text-muted-foreground mt-4 text-base sm:text-lg max-w-xl">
                      Built for the public, students, educators, and institutions to improve disaster preparedness,
                      response skills, and emergency awareness in one connected system.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4 mt-8 mb-8">
                      <div className="rounded-xl border border-border bg-background/70 p-4">
                        <div className="text-2xl font-bold text-foreground">Live</div>
                        <div className="text-sm text-muted-foreground mt-1">Firestore-backed alerts and profile data</div>
                      </div>
                      <div className="rounded-xl border border-border bg-background/70 p-4">
                        <div className="text-2xl font-bold text-foreground">Drills</div>
                        <div className="text-sm text-muted-foreground mt-1">Interactive readiness practice and result tracking</div>
                      </div>
                      <div className="rounded-xl border border-border bg-background/70 p-4">
                        <div className="text-2xl font-bold text-foreground">Progress</div>
                        <div className="text-sm text-muted-foreground mt-1">Learning and assessment records synced to your account</div>
                      </div>
                    </div>

                    <TrustSignals />
                  </div>
                </section>
              </div>
            </div>
          </main>

          <footer className="relative z-10 bg-card/80 backdrop-blur-sm border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground text-center sm:text-left">
                  <span>&copy; {new Date()?.getFullYear()} DisasterEd</span>
                  <span className="hidden sm:inline">&bull;</span>
                  <span>Preparedness and response education for all</span>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground">
                  <a href="#" className="hover:text-primary transition-quick">Privacy Policy</a>
                  <a href="#" className="hover:text-primary transition-quick">Terms</a>
                  <a href="#" className="hover:text-primary transition-quick">Support</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
