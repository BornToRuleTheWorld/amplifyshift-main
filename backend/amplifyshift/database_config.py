import environ
import pymysql

# Set up environ
env = environ.Env()

# Use PyMySQL as MySQL DB driver
pymysql.version_info = (1, 4, 6, 'final', 0)
pymysql.install_as_MySQLdb()
