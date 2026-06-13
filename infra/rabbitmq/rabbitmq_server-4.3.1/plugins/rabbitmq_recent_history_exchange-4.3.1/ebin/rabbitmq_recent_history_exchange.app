{application, 'rabbitmq_recent_history_exchange', [
	{description, "RabbitMQ Recent History Exchange"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['rabbit_db_rh_exchange','rabbit_db_rh_exchange_m2k_converter','rabbit_exchange_type_recent_history']},
	{registered, []},
	{applications, [kernel,stdlib,rabbit_common,rabbit,khepri,khepri_mnesia_migration]},
	{optional_applications, []},
	{env, []},
		{broker_version_requirements, []}
]}.