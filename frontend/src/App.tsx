// import { useMemo } from "react";
import { Map } from "./components/Map";
import { MapZoom } from "./components/MapZoom";
import { useState, useEffect } from "react";
import "./index.css";
import { LoginModal } from "./components/LoginModal";
import { Button } from "./components/ui/button";
import { Dialog } from "./components/ui/dialog";
import { PostSidebar, SideBarToggle } from "./components/PostSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/shad-sidebar";
import { ModeToggle } from "./components/ui/themes";
import { fetchPosts, logout } from "./lib/fetch";
import { VerifyEmailModal } from "./components/VerifyEmailModal";
import { ForgotPasswordModal } from "./components/ForgotPasswordModal";

// const UCFLong = 28.60235;
// const UCFLat = -81.2002;

function App() {
  const [user, setUser] = useState<{ firstName: string, lastName: string, email: string} | null>(null);
  const [email, setEmail] = useState<string>('');
  const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [resetOpen, setResetOpen] = useState<boolean>(false);
  const [hasClickedLogin, setHasClickedLogin] = useState(false);

  useEffect(() => {
    fetchPosts().then(setFetchedPosts);
    console.log(user)
  }, []);

  return (
    <SidebarProvider className="w-screen h-screen absolute top-0 left-0">
      <PostSidebar posts={fetchedPosts} user={user} />

      <SidebarInset>
        {/* Everything that gets moved by the sidebar goes below */}

        <Map posts={fetchedPosts}>
          <div className="flex gap-2">
            <SideBarToggle />
            <MapZoom />
            <ModeToggle />
          </div>

          {user ? (
            <Button
              onClick={() => {
                logout(); 
                setUser(null); 
                setHasClickedLogin(false);
              }}
              size="lg"
              className="absolute top-6 right-10 p-4 w-[8rem] h-[3rem] text-2xl inset-shadow-[0_2px_8px_rgba(0,0,0,0.2)] shadow-[0_0_10px_rgba(0,0,0,.5)]  shadow-white"
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  setHasClickedLogin(true);
                  setLoginOpen(true);
                }}
                className="absolute top-6 right-10 p-4 w-[8rem] h-[3rem] text-2xl inset-shadow-[0_2px_8px_rgba(0,0,0,0.2)] shadow-[0_0_10px_rgba(0,0,0,.5)]  shadow-white"
              >
                Login
              </Button>
              <Dialog open={loginOpen && hasClickedLogin} onOpenChange={setLoginOpen}>
                <LoginModal 
                  onLoginSuccess={(userData) => setUser(userData)} 
                  onLoginFailure={(email) => setEmail(email)}
                  setVerifyOpen={setOpen} 
                  setLoginOpen={setLoginOpen} 
                  setResetOpen={setResetOpen}
                />
              </Dialog>
            </>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <VerifyEmailModal setOpen={setOpen} passedEmail={email}/>
          </Dialog>
          <Dialog open={resetOpen} onOpenChange={setResetOpen}>
            <ForgotPasswordModal setResetOpen={setResetOpen} passedEmail={email}/>
          </Dialog>
        </Map>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
