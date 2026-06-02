package in.moon.android.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface RouteDao {
    @Query("SELECT * FROM cached_routes ORDER BY timestamp DESC")
    suspend fun getAllCachedRoutes(): List<CachedRoute>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRoute(route: CachedRoute)

    @Query("DELETE FROM cached_routes WHERE id = :routeId")
    suspend fun deleteRouteById(routeId: String)

    @Query("DELETE FROM cached_routes")
    suspend fun clearAll()
}
