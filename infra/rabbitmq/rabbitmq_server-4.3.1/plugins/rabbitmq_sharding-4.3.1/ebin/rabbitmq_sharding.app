{application, 'rabbitmq_sharding', [
	{description, "RabbitMQ Sharding Plugin"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['rabbit_sharding_exchange_decorator','rabbit_sharding_interceptor','rabbit_sharding_policy_validator','rabbit_sharding_shard','rabbit_sharding_util']},
	{registered, []},
	{applications, [kernel,stdlib,rabbit_common,rabbit]},
	{optional_applications, []},
	{env, []},
		{broker_version_requirements, []}
]}.