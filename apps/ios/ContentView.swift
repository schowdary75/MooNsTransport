import SwiftUI

@MainActor
final class AppModel: ObservableObject {
  @Published var city: String = "Delhi"
  @Published var search: String = "Connaught Place to New Delhi Railway Station"
  @Published var selectedMode: String = "Metro"
  @Published var lastTicketStatus: String = "Metro booking confirmed"
}

struct ContentView: View {
  @StateObject private var model = AppModel()

  var body: some View {
    TabView {
      HomeView(model: model)
        .tabItem {
          Label("Home", systemImage: "house.fill")
        }

      RouteView(model: model)
        .tabItem {
          Label("Routes", systemImage: "arrow.triangle.turn.up.right.diamond.fill")
        }

      BookingView(model: model)
        .tabItem {
          Label("Tickets", systemImage: "ticket.fill")
        }

      TrackingView(model: model)
        .tabItem {
          Label("Track", systemImage: "location.fill")
        }

      ProfileView(model: model)
        .tabItem {
          Label("Profile", systemImage: "person.crop.circle.fill")
        }
    }
  }
}

private struct HomeView: View {
  @ObservedObject var model: AppModel

  var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 18) {
        hero
        cityChooser
        highlights
      }
      .padding(20)
    }
  }

  private var hero: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text("Moon")
        .font(.largeTitle.bold())
      Text("India's transit super-app")
        .font(.title3)
        .foregroundStyle(.secondary)
      Text("Native route planning, booking, tracking, and account management built for iPhone and iPad.")
        .foregroundStyle(.secondary)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(20)
    .background(
      LinearGradient(
        colors: [
          Color(red: 0.91, green: 0.97, blue: 1.0),
          Color(red: 0.96, green: 0.94, blue: 1.0),
        ],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
      )
    )
    .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
  }

  private var cityChooser: some View {
    VStack(alignment: .leading, spacing: 12) {
      SectionHeader(title: "City")
      HStack(spacing: 8) {
        ForEach(["Delhi", "Mumbai", "Bengaluru"], id: \.self) { city in
          CityChip(title: city, selected: model.city == city) {
            model.city = city
          }
        }
      }
      Text("Active city: \(model.city)")
        .foregroundStyle(.secondary)
    }
  }

  private var highlights: some View {
    VStack(alignment: .leading, spacing: 12) {
      SectionHeader(title: "Coverage")
      ForEach([
        ("Metro", "Delhi, Mumbai, Bengaluru, Chennai, Hyderabad"),
        ("Train", "PNR, tickets, and station search"),
        ("Bus", "State RTC discovery and seat selection"),
        ("Flights", "Domestic search and partner deep links"),
      ], id: \.0) { item in
        InfoCard(title: item.0, body: item.1)
      }
    }
  }
}

private struct RouteView: View {
  @ObservedObject var model: AppModel

  var body: some View {
    FeatureList(
      title: "Route planner",
      subtitle: model.search,
      items: [
        "Origin and destination search",
        "Multi-modal itinerary comparison",
        "Fare estimates and journey duration",
        "Favourite route storage",
      ],
      footer: "Selected mode: \(model.selectedMode)"
    )
  }
}

private struct BookingView: View {
  @ObservedObject var model: AppModel

  var body: some View {
    FeatureList(
      title: "Bookings",
      subtitle: model.lastTicketStatus,
      items: [
        "Train and metro tickets",
        "Payment history and invoices",
        "Refund and cancellation states",
        "QR ticket handoff",
      ],
      footer: "City: \(model.city)"
    )
  }
}

private struct TrackingView: View {
  @ObservedObject var model: AppModel

  var body: some View {
    FeatureList(
      title: "Live tracking",
      subtitle: "Vehicles around \(model.city)",
      items: [
        "Vehicle position updates",
        "ETA and delay alerts",
        "Route subscriptions",
        "Operator fleet status",
      ],
      footer: "Tracking context is shared from the home tab"
    )
  }
}

private struct ProfileView: View {
  @ObservedObject var model: AppModel

  var body: some View {
    FeatureList(
      title: "Profile",
      subtitle: model.city,
      items: [
        "Saved places and favourites",
        "Journey history",
        "Language and privacy settings",
        "Account deletion request",
      ],
      footer: "Session state can follow the same model"
    )
  }
}

private struct FeatureList: View {
  let title: String
  let subtitle: String
  let items: [String]
  let footer: String

  var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(title)
          .font(.largeTitle.bold())
        Text(subtitle)
          .foregroundStyle(.secondary)
        ForEach(items, id: \.self) { item in
          InfoCard(title: item, body: "")
        }
        Text(footer)
          .font(.footnote)
          .foregroundStyle(.secondary)
      }
      .padding(20)
    }
  }
}

private struct CityChip: View {
  let title: String
  let selected: Bool
  let action: () -> Void

  var body: some View {
    Button(action: action) {
      Text(title)
        .font(.subheadline.weight(.semibold))
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(selected ? Color.accentColor : Color(.secondarySystemBackground))
        .foregroundStyle(selected ? .white : .primary)
        .clipShape(Capsule())
    }
    .buttonStyle(.plain)
  }
}

private struct SectionHeader: View {
  let title: String

  var body: some View {
    Text(title)
      .font(.title2.bold())
  }
}

private struct InfoCard: View {
  let title: String
  let body: String

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(title)
        .font(.headline)
      if !body.isEmpty {
        Text(body)
          .font(.subheadline)
          .foregroundStyle(.secondary)
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(16)
    .background(Color(.secondarySystemBackground))
    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
  }
}

#Preview {
  ContentView()
}

