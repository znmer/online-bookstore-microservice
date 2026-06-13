{application, 'rabbitmq_queue_federation', [
	{description, "RabbitMQ Queue Federation"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['rabbit_federation_queue','rabbit_federation_queue_link','rabbit_federation_queue_link_sup_sup','rabbit_queue_federation_app','rabbit_queue_federation_sup']},
	{registered, []},
	{applications, [kernel,stdlib,rabbit_common,rabbit,amqp_client,rabbitmq_federation_common]},
	{optional_applications, []},
	{mod, {'rabbit_queue_federation_app', []}},
	{env, [
	    {pgroup_name_cluster_id, false},
	    {connection_close_timeout, 5000}
	  ]},
		{broker_version_requirements, []}
]}.