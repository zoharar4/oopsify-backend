import configProd from './prod.js'
import configDev from './dev.js'


export var config
if (process.env.NODE_ENV === 'production') {
  config = configProd
} else {
  console.log('process.env.NODE_ENV :',process.env.NODE_ENV )
  config = configDev
}
// config.isGuestMode = true


//ASlAdWIGoDG3nPgU
//mongodb+srv://zoharar7788_db_user:ASlAdWIGoDG3nPgU@oopsify.legpe7f.mongodb.net/?appName=oopsify