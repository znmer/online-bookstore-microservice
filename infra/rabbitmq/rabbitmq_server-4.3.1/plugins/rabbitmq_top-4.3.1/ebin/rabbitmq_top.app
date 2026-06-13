{application, 'rabbitmq_top', [
	{description, "RabbitMQ Top"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['rabbit_top_app','rabbit_top_extension','rabbit_top_sup','rabbit_top_util','rabbit_top_wm_ets_tables','rabbit_top_wm_process','rabbit_top_wm_processes','rabbit_top_worker']},
	{registered, []},
	{applications, [kernel,stdlib,rabbit_common,rabbit,amqp_client,rabbitmq_management]},
	{optional_applications, []},
	{mod, {'rabbit_top_app', []}},
	{env, []},
		{broker_version_requirements, []}
]}.