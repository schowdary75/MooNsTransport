import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), routeName: "DMRC Blue Line", etaMinutes: 5)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), routeName: "DMRC Blue Line", etaMinutes: 5)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .minute, value: hourOffset * 15, to: currentDate)!
            let entry = SimpleEntry(date: entryDate, routeName: "DMRC Blue Line", etaMinutes: max(0, 5 - hourOffset * 2))
            entries.append(entry)
        }
        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let routeName: String
    let etaMinutes: Int
}

struct NextBusWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("🌙 Moon Transit")
                .font(.caption)
                .foregroundColor(.secondary)
            Text(entry.routeName)
                .font(.headline)
                .minimumScaleFactor(0.8)
            Spacer()
            HStack {
                Text("\(entry.etaMinutes)")
                    .font(.system(size: 36, weight: .bold, design: .rounded))
                    .foregroundColor(.green)
                Text("mins")
                    .font(.footnote)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
    }
}

struct NextBusWidget: Widget {
    let kind: String = "NextBusWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            NextBusWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Next Bus Widget")
        .description("Track the next bus/metro ETA on your Home Screen.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
