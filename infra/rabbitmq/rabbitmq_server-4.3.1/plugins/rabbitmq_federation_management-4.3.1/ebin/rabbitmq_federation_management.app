{application, 'rabbitmq_federation_management', [
	{description, "RabbitMQ Federation Management"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['rabbit_federation_mgmt']},
	{registered, []},
	{applications, [kernel,stdlib,amqp_client,rabbit_common,rabbit,rabbitmq_management,rabbitmq_federation]},
	{optional_applications, []},
	{env, []},
		{broker_version_requirements, []}
]}.