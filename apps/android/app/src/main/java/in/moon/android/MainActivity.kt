package in.moon.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

private enum class Screen {
  Home,
  Routes,
  Bookings,
  Track,
  Profile,
}

private data class MoonState(
  val city: String = "Delhi",
  val search: String = "Connaught Place to New Delhi Railway Station",
  val selectedMode: String = "Metro",
  val recentBooking: String = "Metro booking confirmed",
)

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    setContent {
      MoonApp()
    }
  }
}

@Composable
fun MoonApp() {
  MaterialTheme {
    var screen by rememberSaveable { mutableStateOf(Screen.Home) }
    var state by rememberSaveable {
      mutableStateOf(MoonState())
    }

    Scaffold(
      topBar = {
        TopAppBar(
          title = { Text(text = "Moon - ${state.city}") },
        )
      },
      bottomBar = {
        NavigationBar {
          navItems.forEach { item ->
            NavigationBarItem(
              selected = screen == item.screen,
              onClick = { screen = item.screen },
              icon = {},
              label = { Text(item.label) },
            )
          }
        }
      }
    ) { padding ->
      Surface(modifier = Modifier.fillMaxSize().padding(padding)) {
        when (screen) {
          Screen.Home -> HomeScreen(
            state = state,
            onCityChange = { state = state.copy(city = it) },
            onQuickAction = { screen = it },
          )
          Screen.Routes -> RoutesScreen(
            state = state,
            onSearchChange = { state = state.copy(search = it) },
            onModeChange = { state = state.copy(selectedMode = it) },
          )
          Screen.Bookings -> BookingsScreen(
            state = state,
            onRefresh = { state = state.copy(recentBooking = "Ticket refreshed for ${state.city}") },
          )
          Screen.Track -> TrackingScreen(city = state.city)
          Screen.Profile -> ProfileScreen(city = state.city)
        }
      }
    }
  }
}

private data class NavItem(val label: String, val screen: Screen)

private val navItems = listOf(
  NavItem("Home", Screen.Home),
  NavItem("Routes", Screen.Routes),
  NavItem("Tickets", Screen.Bookings),
  NavItem("Track", Screen.Track),
  NavItem("Profile", Screen.Profile),
)

@Composable
private fun HomeScreen(
  state: MoonState,
  onCityChange: (String) -> Unit,
  onQuickAction: (Screen) -> Unit,
) {
  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .padding(20.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
  ) {
    HeroCard(state.city, state.search)
    CityChips(selected = state.city, onSelect = onCityChange)
    FeatureStrip()
    QuickActions(onQuickAction)
  }
}

@Composable
private fun HeroCard(city: String, search: String) {
  Card(
    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
    modifier = Modifier.fillMaxWidth(),
  ) {
    Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
      Text(text = "India's transit super-app", style = MaterialTheme.typography.headlineMedium)
      Text(
        text = "Planning for $city, with live search context and booked-trip handoff across tabs.",
        style = MaterialTheme.typography.bodyLarge,
      )
      Text(
        text = search,
        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Medium),
      )
      Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        AccentPill("Metro")
        AccentPill("Rail")
        AccentPill("Bus")
      }
    }
  }
}

@Composable
private fun CityChips(selected: String, onSelect: (String) -> Unit) {
  Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
    Text(text = "City", style = MaterialTheme.typography.titleLarge)
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
      listOf("Delhi", "Mumbai", "Bengaluru").forEach { city ->
        FilterChip(selected = selected == city, onClick = { onSelect(city) }, label = { Text(city) })
      }
    }
  }
}

@Composable
private fun AccentPill(text: String) {
  Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
    Text(
      text = text,
      modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
      style = MaterialTheme.typography.labelLarge,
      fontWeight = FontWeight.SemiBold,
    )
  }
}

@Composable
private fun FeatureStrip() {
  Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
    Text(text = "Transport coverage", style = MaterialTheme.typography.titleLarge)
    listOf(
      "Metro" to "Delhi, Mumbai, Bengaluru, Chennai, Hyderabad",
      "Train" to "PNR checks, e-tickets, and station search",
      "Bus" to "State RTC discovery and seat selection",
      "Flights" to "Domestic search and partner deep links",
    ).forEach { (title, detail) ->
      Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
          Text(text = title, style = MaterialTheme.typography.titleMedium)
          Spacer(modifier = Modifier.height(4.dp))
          Text(text = detail, style = MaterialTheme.typography.bodyMedium)
        }
      }
    }
  }
}

@Composable
private fun QuickActions(onQuickAction: (Screen) -> Unit) {
  Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
    Text(text = "Quick actions", style = MaterialTheme.typography.titleLarge)
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
      Button(onClick = { onQuickAction(Screen.Routes) }) { Text("Plan") }
      Button(onClick = { onQuickAction(Screen.Bookings) }) { Text("Tickets") }
      Button(onClick = { onQuickAction(Screen.Track) }) { Text("Track") }
    }
  }
}

@Composable
private fun RoutesScreen(
  state: MoonState,
  onSearchChange: (String) -> Unit,
  onModeChange: (String) -> Unit,
) {
  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .padding(20.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
    Text(text = "Route planner", style = MaterialTheme.typography.headlineMedium)
    Card(modifier = Modifier.fillMaxWidth()) {
      Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(text = "Search context", style = MaterialTheme.typography.titleMedium)
        Text(text = state.search, style = MaterialTheme.typography.bodyMedium)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          Button(onClick = { onSearchChange("Connaught Place to New Delhi Railway Station") }) {
            Text("Reset")
          }
          Button(onClick = { onSearchChange("Delhi Metro Blue Line") }) {
            Text("Sample")
          }
        }
      }
    }
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
      listOf("Metro", "Bus", "Train").forEach { mode ->
        FilterChip(selected = state.selectedMode == mode, onClick = { onModeChange(mode) }, label = { Text(mode) })
      }
    }
    DetailCard("Recent search", state.search)
    DetailCard("Primary mode", state.selectedMode)
    DetailCard("Route suggestion", "Connaught Place to New Delhi Railway Station")
  }
}

@Composable
private fun BookingsScreen(state: MoonState, onRefresh: () -> Unit) {
  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .padding(20.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
  ) {
    Text(text = "Bookings", style = MaterialTheme.typography.headlineMedium)
    DetailCard("Last booking", state.recentBooking)
    DetailCard("Fare", "Rs. 18")
    DetailCard("Status", "Confirmed")
    Button(onClick = onRefresh) { Text("Refresh ticket") }
  }
}

@Composable
private fun TrackingScreen(city: String) {
  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .padding(20.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
  ) {
    Text(text = "Live tracking", style = MaterialTheme.typography.headlineMedium)
    DetailCard("Location", "Vehicles around $city")
    DetailCard("ETA", "5 min")
    DetailCard("Delay", "On time")
  }
}

@Composable
private fun ProfileScreen(city: String) {
  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .padding(20.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
  ) {
    Text(text = "Profile", style = MaterialTheme.typography.headlineMedium)
    DetailCard("Home city", city)
    DetailCard("Saved places", "Home, Work, Station")
    DetailCard("Privacy", "Account deletion and consent controls")
  }
}

@Composable
private fun DetailCard(title: String, value: String) {
  Card(modifier = Modifier.fillMaxWidth()) {
    Column(modifier = Modifier.padding(16.dp)) {
      Text(text = title, style = MaterialTheme.typography.titleMedium)
      Spacer(modifier = Modifier.height(4.dp))
      Text(text = value, style = MaterialTheme.typography.bodyLarge)
    }
  }
}


