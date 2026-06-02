package in.moon.android.data

import android.content.Context
import androidx.room.Database
import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Room
import androidx.room.RoomDatabase

@Entity(tableName = "cached_routes")
data class CachedRoute(
    @PrimaryKey val id: String,
    val origin: String,
    val destination: String,
    val durationMinutes: Int,
    val distanceKm: Double,
    val fareInRupees: Int,
    val modes: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Database(entities = [CachedRoute::class], version = 1, exportSchema = false)
abstract class LocalRouteDatabase : RoomDatabase() {
    abstract fun routeDao(): RouteDao

    companion object {
        @Volatile
        private var INSTANCE: LocalRouteDatabase? = null

        fun getDatabase(context: Context): LocalRouteDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    LocalRouteDatabase::class.java,
                    "moon_route_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
