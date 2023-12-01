# Project Setup Instructions

## Initial Setup

1. **Set Up MySQL Database**

   - **Run Environment Setup Script**: Start by setting up your environment variables. Execute the `set_env.sh` script in your terminal.

     ```bash
     ./set_env.sh
     ```

   - **Initialize the Database**: Next, initialize your MySQL database. Run the `init-db.sh` script located in the `sql-scripts` directory.
     ```bash
     ./sql-scripts/init-db.sh
     ```

   This will set up the necessary environment and initialize your MySQL database with the required tables and configurations.
