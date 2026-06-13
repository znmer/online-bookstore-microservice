{application, 'rabbitmq_federation', [
	{description, "Deprecated no-op RabbitMQ Federation"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['rabbitmq_federation_noop']},
	{registered, []},
	{applications, [kernel,stdlib,rabbit,rabbitmq_queue_federation,rabbitmq_exchange_federation]},
	{optional_applications, []},
	{env, []}
]}.