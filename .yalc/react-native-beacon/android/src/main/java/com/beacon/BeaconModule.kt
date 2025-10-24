package com.beacon

import android.Manifest
import android.app.NotificationManager
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.app.ActivityCompat.startActivityForResult
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener
import java.util.HashMap


class BeaconModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), PermissionListener {

  private val beaconServiceConnection: ConnectService by lazy { ConnectService(reactContext, BeaconService::class.java) }
  private var pendingPermissionPromise: Promise? = null

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun setOptions(options: ReadableMap) {
    beaconServiceConnection.setOptions(options)

    Notification.updateNotification(reactApplicationContext, HashMap(options.toHashMap()))

    Notification.notificationBuilder?.get()?.run {
      setContentTitle(Notification.notificationContentTitle)
      setContentText(Notification.notificationContentText)

      val smallIconId = Notification.getSmallIconId(reactApplicationContext)
      if (smallIconId != 0) {
        setSmallIcon(smallIconId);
      }

      val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager;
      notificationManager.notify(
        Notification.notificationId,
        build()
      );
    }
  }

  @ReactMethod
  fun requestPermissions(promise: Promise) {
    val activity = currentActivity as PermissionAwareActivity?
    if (activity == null) {
      promise.reject(IllegalStateException("Activity not available"))
      return
    }

    val accessFineLocationSelfPermission = ActivityCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.ACCESS_FINE_LOCATION)

    val permissions = mutableListOf<String>();

    if (accessFineLocationSelfPermission != PackageManager.PERMISSION_GRANTED) {
      permissions.add(Manifest.permission.ACCESS_FINE_LOCATION)
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val bluetoothConnectSelfPermission = ContextCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.BLUETOOTH_CONNECT)

      if (bluetoothConnectSelfPermission != PackageManager.PERMISSION_GRANTED) {
        permissions.add(Manifest.permission.BLUETOOTH_CONNECT)
      }

      val bluetoothScanSelfPermission = ContextCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.BLUETOOTH_SCAN)

      if (bluetoothScanSelfPermission != PackageManager.PERMISSION_GRANTED) {
        permissions.add(Manifest.permission.BLUETOOTH_SCAN)
      }
    }

    if (permissions.isNotEmpty()) {
      pendingPermissionPromise?.reject(IllegalStateException("Another permission request is in progress"))
      pendingPermissionPromise = null
      pendingPermissionPromise = promise
      activity.requestPermissions(permissions.toTypedArray(), REQUEST_PERMISSIONS, this)
    } else {
      promise.resolve(true)
    }
  }

  @ReactMethod
  fun enableBluetooth() {
    val bluetoothManager = reactApplicationContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
    val bluetoothAdapter = bluetoothManager.adapter
    if (!bluetoothAdapter.isEnabled) {
      val intentBtEnabled = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
      if (ActivityCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED) {
        currentActivity?.startActivityForResult(intentBtEnabled, REQUEST_ENABLE_BLUETOOTH)
      }
    }
  }

  @ReactMethod
  fun startService(promise: Promise) {
    beaconServiceConnection.startService(promise)
  }

  @ReactMethod
  fun stopService(promise: Promise) {
    beaconServiceConnection.stopService(promise)
  }

  @ReactMethod
  fun startBeaconScan(beacons: ReadableArray) {
    beaconServiceConnection.mService?.run {
      this as BeaconService
      startBeaconScan(beacons)
    }
  }

  @ReactMethod
  fun stopBeaconScan() {
    beaconServiceConnection.mService?.run {
      this as BeaconService
      stopBeaconScan()
    }
  }

  @ReactMethod
  fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
    // Required for NativeEventEmitter
  }

  @ReactMethod
  fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int) {
    // Required for NativeEventEmitter
  }

  companion object {
    const val NAME = "Beacon"

    const val TAG = "BeaconModule"

    const val REQUEST_ENABLE_BLUETOOTH = 1
    const val REQUEST_PERMISSIONS = 2
  }

  // region PermissionListener

  override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray): Boolean {
    if (requestCode != REQUEST_PERMISSIONS) {
      return false
    }

    val granted = grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }
    pendingPermissionPromise?.resolve(granted)
    pendingPermissionPromise = null
    return true
  }

  // endregion PermissionListener
}
