{application, 'rabbitmq_auth_backend_internal_loopback', [
	{description, "RabbitMQ Internal Loopback Authentication Backend"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['rabbit_auth_backend_internal_loopback','rabbit_auth_backend_internal_loopback_app']},
	{registered, []},
	{applications, [kernel,stdlib,rabbit_common,rabbit]},
	{optional_applications, []},
	{mod, {'rabbit_auth_backend_internal_loopback_app', []}},
	{env, [

	  ]},
		{broker_version_requirements, []}
]}.