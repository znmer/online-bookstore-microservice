{application, 'rabbitmq_consistent_hash_exchange', [
	{description, "Consistent Hash Exchange Type"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['Elixir.RabbitMQ.CLI.Diagnostics.Commands.ConsistentHashExchangeRingStateCommand','rabbit_db_ch_exchange','rabbit_db_ch_exchange_m2k_converter','rabbit_exchange_type_consistent_hash']},
	{registered, []},
	{applications, [kernel,stdlib,rabbit_common,rabbit,khepri,khepri_mnesia_migration]},
	{optional_applications, []},
	{env, []},
		{broker_version_requirements, []}
]}.