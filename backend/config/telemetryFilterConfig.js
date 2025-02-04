const telemetryFilterConfig = {
    "2D_MAP": {
      30: ["roll", "pitch", "yaw"],
      33: ["lat", "lon", "alt"],
      74: ["heading", "groundspeed"],
      147: ["batteryRemaining"],
      253: ["text"],
    },

    "CHART": {
      24: ["satellitesVisible"],
      33: ["alt"],
      74: ["groundspeed"],
      147: ["temperature", "batteryRemaining", "voltage"],
      253: ["text"],
    },
  };
  
  module.exports = telemetryFilterConfig;  