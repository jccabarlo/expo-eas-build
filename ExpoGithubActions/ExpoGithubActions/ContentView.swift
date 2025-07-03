import SwiftUI

struct ContentView: View {
    @State private var session: Session?

    var body: some View {
        VStack {
            if let session = session {
                HomeView()
            } else {
                LoginView()
            }
        }
        .onAppear {
            Task {
                for await (event, session) in supabase.auth.authEventChange {
                    if session != nil && event == .signedIn {
                        self.session = session
                    }
                    if event == .signedOut {
                        self.session = nil
                    }
                }
            }
        }
    }
}