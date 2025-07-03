import SwiftUI

struct NewThoughtView: View {
    @State private var thought = ""

    var body: some View {
        VStack {
            TextEditor(text: $thought)
                .border(Color.gray, width: 1)
                .padding()
            Button("Save") {
                // Save thought action
            }
            .padding()
        }
        .padding()
    }
}
